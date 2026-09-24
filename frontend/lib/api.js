import axios from 'axios'
import useAuthStore from '@/store/authStore'
import {
  isOnline,
  shouldQueueEndpoint,
  queueOfflineWrite,
  readFromCatalog,
  buildRequestKey,
  invalidateCatalog,
} from '@/lib/offlineStore'
import { catalogPut } from '@/lib/db'

// Development console watermark.
if (typeof window !== 'undefined') {
  console.log(
    '%c Developed By: Fahad Bin Siddique || fahad.com.bd',
    'background: #1e1e2f; color: #00ffcc; padding: 6px 12px; border-radius: 8px; font-weight: bold; font-family: sans-serif;'
  );
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,

  withCredentials: true,

  timeout: 30000,

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    
  },
})

// Offline adapter — serves cached GETs from IndexedDB and queues mutations
// when offline, so the app never stalls on a 10s timeout while disconnected.

const defaultAdapter = axios.getAdapter
  ? axios.getAdapter(axios.defaults.adapter)
  : axios.defaults.adapter

const offlineAdapter = async (config) => {
  // Skip offline logic on the server (no IndexedDB).
  if (typeof window === 'undefined') return defaultAdapter(config)

  const method = (config.method || 'get').toLowerCase()
  const url = buildRequestKey(config)

  // Replayed queue entries always hit the network.
  if (config._fromQueue) return defaultAdapter(config)

  if (isOnline()) return defaultAdapter(config)

  // OFFLINE from here on
  if (method === 'get') {
    const cached = await readFromCatalog(url)
    if (cached !== undefined) {
      return {
        data: cached,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        fromOffline: true,
      }
    }
    throw new Error('You are offline and this data is not cached.')
  }

  // Mutations — save to the sync queue instead of failing silently.
  if (method !== 'get' && shouldQueueEndpoint(url)) {
    await queueOfflineWrite(method, url, config.data)
    return {
      data: { offline_queued: true },
      status: 202,
      statusText: 'Accepted',
      headers: {},
      config,
      fromOffline: true,
      queued: true,
    }
  }

  throw new Error('You are offline.')
}

// Only apply the offline adapter on the client — the server has no IndexedDB
// and its default httpAdapter handles baseURL resolution correctly.
if (typeof window !== 'undefined') {
  api.defaults.adapter = offlineAdapter
}

// ── Refresh Mutex ──────────────────────────────────────────────────────────
// Only one POST /api/auth/refresh/ may be in flight. Concurrent 401s queue
// up and replay after the first refresh completes, avoiding blacklist races
// caused by ROTATE_REFRESH_TOKENS + BLACKLIST_AFTER_ROTATION on Django.
let isRefreshing = false;
let pendingQueue = [];

function resolvePendingQueue() {
  pendingQueue.forEach(({ resolve }) => resolve());
  pendingQueue = [];
}

function rejectPendingQueue(error) {
  pendingQueue.forEach(({ reject }) => reject(error));
  pendingQueue = [];
}

api.interceptors.response.use(
  async (response) => {
    const method = (response.config.method || 'get').toLowerCase()

    // Persist successful GETs to the IndexedDB catalog for offline reads.
    if (
      !response.fromOffline &&
      response.config &&
      method === 'get' &&
      response.data !== undefined
    ) {
      await catalogPut(buildRequestKey(response.config), response.data)
    }

    // After a successful mutation, invalidate stale catalog entries so
    // the next read fetches fresh data from the server.
    if (
      !response.fromOffline &&
      method !== 'get' &&
      response.config?.url
    ) {
      await invalidateStaleCatalog(response.config.url)
    }

    return response
  },

  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/api/auth/refresh/')
    ) {
      // If a refresh is already in flight, queue this request.
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      isRefreshing = true;
      originalRequest._retry = true;

      try {
        await api.post('/api/auth/refresh/')
        resolvePendingQueue();
        return api(originalRequest);
      } catch (refreshError) {
        rejectPendingQueue(refreshError);

        if (typeof window !== 'undefined') {
          useAuthStore.getState().clearError()
          useAuthStore.setState({ user: null, isAuthenticated: false })
          localStorage.removeItem('auth-storage');
          window.location.href = '/'
        }

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error)
  },
)

/**
 * After a mutation, invalidate catalog entries for the affected collection.
 * This ensures the next read fetches fresh data instead of stale cached responses.
 *
 * Strategy: derive the collection URL from the mutation URL by stripping the
 * trailing ID segment, then invalidate that collection's catalog entry.
 *
 * Example:
 *   DELETE /api/admin/blogs/42/  →  invalidate /api/admin/blogs/
 *   POST   /api/admin/blogs/     →  invalidate /api/admin/blogs/
 *   PATCH  /api/consultants/availability/7/  →  invalidate /api/consultants/availability/
 */
async function invalidateStaleCatalog(mutationUrl) {
  try {
    // Normalize: strip trailing slash and ID numbers, then add trailing slash.
    const cleaned = mutationUrl.replace(/\/+$/, '');
    const parts = cleaned.split('/');
    const lastSegment = parts[parts.length - 1];

    // If the last segment is a numeric ID, strip it to get the collection URL.
    const collectionPath = /^\d+$/.test(lastSegment)
      ? parts.slice(0, -1).join('/') + '/'
      : cleaned + '/';

    // Build patterns to invalidate: the collection URL and its base.
    const patterns = [new RegExp(collectionPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))];

    await invalidateCatalog(patterns);
  } catch {
    // Catalog invalidation is best-effort — don't block the response.
  }
}

export default api
