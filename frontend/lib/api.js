// lib/api.js

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


// Create the Axios instance.

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,

  // Automatically send and receive cookies.
  withCredentials: true,

  // Request timeout after 30 seconds.
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

// Response interceptor.

api.interceptors.response.use(
  // Successful response.

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

  // Error response.

  async (error) => {
    // Preserve the original request before retrying.
    const originalRequest = error.config

    /**
     * The backend returns 401 when the access token has expired.
     *
     * In that case:
     * 1. A refresh token is used to obtain a new access token.
     * 2. The original request is retried.
     */

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/api/auth/refresh/') &&
      !originalRequest.url.includes('/api/auth/me/')
    ) {
      // Prevent retry loops.
      originalRequest._retry = true

      try {
        // Get a new access token.

        await api.post('/api/auth/refresh/')

        // Retry the previous request.

        return api(originalRequest)
      } catch (refreshError) {
        /**
         * If the refresh token is also expired, stop the retry loop.
         */
        if (typeof window !== 'undefined') {
          // Clear the in-memory auth state so stale errors do not persist.
          useAuthStore.getState().clearError()
          
          // Reset the auth state manually instead of calling logout repeatedly in the background.
          useAuthStore.setState({ user: null, isAuthenticated: false })

          // Remove the persisted auth data so the guard does not receive stale values.
          localStorage.removeItem('auth-storage');

          // Send the user back to the home page.
          window.location.href = '/'
        }

        return Promise.reject(refreshError)
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
