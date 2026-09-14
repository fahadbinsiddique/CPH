// lib/db.js — minimal IndexedDB wrapper for offline caching + write queue.

import { openDB } from "idb";

const DB_NAME = "cph-offline-db";
const DB_VERSION = 1;

// TTL: catalog entries older than 7 days are considered stale.
const CATALOG_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// Cleanup runs at most once per hour.
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;

let dbPromise;
let consecutiveFailures = 0;
const MAX_FAILURES = 3;

function getDB() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('IndexedDB is not available on the server.'))
  }
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // GET responses (consultants, blogs, assessments) keyed by request URL.
        if (!db.objectStoreNames.contains("catalog")) {
          db.createObjectStore("catalog", { keyPath: "url" });
        }
        // Pending offline mutations (booking / appointment / assessment).
        if (!db.objectStoreNames.contains("queue")) {
          db.createObjectStore("queue", {
            keyPath: "id",
            autoIncrement: true,
          });
        }
        if (!db.objectStoreNames.contains("meta")) {
          db.createObjectStore("meta");
        }
      },
    }).then((db) => {
      consecutiveFailures = 0;
      return db;
    }).catch((err) => {
      consecutiveFailures++;
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
}

/**
 * Reset the database connection. Call when corruption or quota errors are detected.
 * The next getDB() call will attempt to reopen a fresh connection.
 */
export function resetDatabase() {
  dbPromise = null;
  consecutiveFailures = 0;
}

/**
 * Delete the entire database. Use for recovery from corruption or quota exceeded.
 * After calling this, the next getDB() will create a fresh DB.
 */
export async function deleteDatabase() {
  try {
    if (typeof window === 'undefined') return;
    const { deleteDB } = await import("idb");
    await deleteDB(DB_NAME);
  } catch (err) {
    console.error("Failed to delete IndexedDB:", err);
  }
  resetDatabase();
}

export async function catalogPut(url, data) {
  try {
    const db = await getDB();
    await db.put("catalog", { url, data, storedAt: Date.now() });
    // Throttled cleanup — runs at most once per hour.
    scheduleCatalogCleanup(db);
  } catch (err) {
    console.error("IDB catalogPut failed:", err);
  }
}

export async function catalogGet(url) {
  try {
    const db = await getDB();
    const entry = await db.get("catalog", url);
    if (!entry) return undefined;
    // Expired entry — treat as miss and clean up in background.
    if (Date.now() - entry.storedAt > CATALOG_TTL_MS) {
      catalogDelete(url).catch(() => {});
      return undefined;
    }
    return entry.data;
  } catch (err) {
    console.error("IDB catalogGet failed:", err);
    return undefined;
  }
}

export async function catalogDelete(url) {
  try {
    const db = await getDB();
    await db.delete("catalog", url);
  } catch (err) {
    console.error("IDB catalogDelete failed:", err);
  }
}

/**
 * Delete all catalog entries whose URL matches any of the given patterns.
 * @param {RegExp[]} patterns - URL patterns to match against
 */
export async function catalogDeleteByPatterns(patterns) {
  try {
    const db = await getDB();
    const tx = db.transaction("catalog", "readwrite");
    const store = tx.objectStore("catalog");
    let cursor = await store.openCursor();
    while (cursor) {
      if (patterns.some((p) => p.test(cursor.key))) {
        cursor.delete();
      }
      cursor = await cursor.continue();
    }
    await tx.done;
  } catch (err) {
    console.error("IDB catalogDeleteByPatterns failed:", err);
  }
}

/**
 * Clear the entire catalog store.
 */
export async function clearCatalog() {
  try {
    const db = await getDB();
    await db.clear("catalog");
  } catch (err) {
    console.error("IDB clearCatalog failed:", err);
  }
}

/**
 * Clear all stores (catalog, queue, meta). Use for full recovery.
 */
export async function clearAll() {
  try {
    const db = await getDB();
    const tx = db.transaction(["catalog", "queue", "meta"], "readwrite");
    await Promise.all([
      tx.objectStore("catalog").clear(),
      tx.objectStore("queue").clear(),
      tx.objectStore("meta").clear(),
      tx.done,
    ]);
  } catch (err) {
    console.error("IDB clearAll failed:", err);
  }
}

export async function enqueueWrite(method, url, body) {
  try {
    const db = await getDB();
    const id = await db.add("queue", {
      method,
      url,
      body,
      queuedAt: Date.now(),
    });
    return id;
  } catch (err) {
    console.error("IDB enqueueWrite failed:", err);
    return null;
  }
}

export async function peekQueue() {
  try {
    const db = await getDB();
    return await db.getAll("queue");
  } catch (err) {
    console.error("IDB peekQueue failed:", err);
    return [];
  }
}

export async function dequeueWrite(id) {
  try {
    const db = await getDB();
    await db.delete("queue", id);
  } catch (err) {
    console.error("IDB dequeueWrite failed:", err);
  }
}

export async function clearQueue() {
  try {
    const db = await getDB();
    await db.clear("queue");
  } catch (err) {
    console.error("IDB clearQueue failed:", err);
  }
}

export async function countQueue() {
  try {
    const db = await getDB();
    return await db.count("queue");
  } catch (err) {
    console.error("IDB countQueue failed:", err);
    return 0;
  }
}

export async function metaSet(key, value) {
  try {
    const db = await getDB();
    await db.put("meta", value, key);
  } catch (err) {
    console.error("IDB metaSet failed:", err);
  }
}

export async function metaGet(key) {
  try {
    const db = await getDB();
    return (await db.get("meta", key)) ?? undefined;
  } catch (err) {
    console.error("IDB metaGet failed:", err);
    return undefined;
  }
}

// --- Catalog cleanup (throttled) ---

let lastCleanupTime = 0;

function scheduleCatalogCleanup(db) {
  const now = Date.now();
  if (now - lastCleanupTime < CLEANUP_INTERVAL_MS) return;
  lastCleanupTime = now;
  // Fire and forget — cleanup is best-effort.
  catalogCleanUp(db).catch(() => {});
}

async function catalogCleanUp(db) {
  const cutoff = Date.now() - CATALOG_TTL_MS;
  try {
    const tx = db.transaction("catalog", "readwrite");
    const store = tx.objectStore("catalog");
    let cursor = await store.openCursor();
    let deleted = 0;
    while (cursor) {
      if (cursor.value.storedAt < cutoff) {
        cursor.delete();
        deleted++;
      }
      cursor = await cursor.continue();
    }
    await tx.done;
    if (deleted > 0) {
      console.log(`[IDB] Cleaned up ${deleted} expired catalog entries`);
    }
  } catch (err) {
    console.error("IDB catalogCleanUp failed:", err);
  }
}
