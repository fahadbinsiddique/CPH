// lib/db.js — minimal IndexedDB wrapper for offline caching + write queue.

import { openDB } from "idb";

const DB_NAME = "cph-offline-db";
const DB_VERSION = 1;

let dbPromise;

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
    });
  }
  return dbPromise;
}

export async function catalogPut(url, data) {
  try {
    const db = await getDB();
    await db.put("catalog", { url, data, storedAt: Date.now() });
  } catch (err) {
    console.error("IDB catalogPut failed:", err);
  }
}

export async function catalogGet(url) {
  try {
    const db = await getDB();
    const entry = await db.get("catalog", url);
    return entry ? entry.data : undefined;
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