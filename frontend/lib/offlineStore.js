// lib/offlineStore.js — offline-capable data layer for the PWA.
// Reads fall back to an IndexedDB catalog; writes queue and replay when online.

import {
  catalogPut,
  catalogGet,
  catalogDeleteByPatterns,
  enqueueWrite,
  peekQueue,
  dequeueWrite,
  countQueue,
  clearAll,
  resetDatabase,
} from "@/lib/db";

export function isOnline() {
  return typeof navigator !== "undefined"
    ? navigator.onLine
    : true;
}

// Stable cache key for a request: baseURL + path + query params.
export function buildRequestKey(config) {
  const base = (config.baseURL || "").replace(/\/$/, "");
  const path = config.url || "";
  let url = /^https?:\/\//.test(path) ? path : base + path;

  const params = config.params;
  if (params && typeof params === "object") {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) qs.set(k, v);
    }
    const query = qs.toString();
    if (query) url = `${url}?${query}`;
  }
  return url;
}

// Endpoints that must never be queued or served from cache.
const NEVER_QUEUE_PATTERNS = [
  /\/api\/auth\//,
  /\/api\/push\//,
  /\/api\/auth\/refresh\//,
];

function shouldQueue(url) {
  return !NEVER_QUEUE_PATTERNS.some((pattern) => pattern.test(url));
}

export function isOfflineError(err) {
  return (
    !isOnline() ||
    !err?.response ||
    err.message === "Network Error" ||
    err.code === "ERR_NETWORK"
  );
}

// Network-first GET, persisted to the catalog for offline reads.
export async function cacheGet(url, fetcher) {
  const data = await fetcher();
  if (data !== undefined && data !== null) {
    await catalogPut(url, data);
  }
  return data;
}

export { catalogPut };

export async function readFromCatalog(url) {
  return catalogGet(url);
}

// Invalidate catalog entries matching the given URL patterns.
export async function invalidateCatalog(patterns) {
  return catalogDeleteByPatterns(patterns);
}

// Queue an offline mutation (booking / appointment / assessment submit).
export async function queueOfflineWrite(method, url, body) {
  const id = await enqueueWrite(method, url, body);
  return id;
}

// Pending count is always derived from the actual queue — no stale meta store.
export async function getPendingCount() {
  return countQueue();
}

// Replay queued writes. Failed entries stay in the queue for the next attempt.
export async function flushQueue() {
  if (!isOnline()) return { flushed: 0, failed: 0 };

  // Dynamic import to avoid circular dependency at module init time.
  // This is safe: api.js is only needed here for replaying mutations.
  const { default: api } = await import("@/lib/api");
  const pending = await peekQueue();

  let flushed = 0;
  let failed = 0;

  for (const entry of pending) {
    try {
      await api.request({
        method: entry.method,
        url: entry.url,
        data: entry.body,
        _fromQueue: true,
      });
      await dequeueWrite(entry.id);
      flushed += 1;
    } catch (err) {
      // 4xx responses (invalid payload / auth) will never succeed — drop them.
      if (err.response && err.response.status >= 400 && err.response.status < 500) {
        await dequeueWrite(entry.id);
        failed += 1;
      } else {
        failed += 1;
      }
    }
  }

  return { flushed, failed };
}

export function shouldQueueEndpoint(url) {
  return shouldQueue(url);
}

// Full recovery: clear all IndexedDB data and reset the connection.
export async function resetOfflineStorage() {
  await clearAll();
  resetDatabase();
}
