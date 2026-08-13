const CACHE_VERSION = "v1";
const STATIC_CACHE = `cph-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `cph-dynamic-${CACHE_VERSION}`;
const API_CACHE = `cph-api-${CACHE_VERSION}`;

// Offline-pages
const STATIC_ASSETS = [
  "/",
  "/offline.html",
  "/consultant",
  "/blog",
  "/assessment",
  "/icons/web-app-manifest-192x192.png",
  "/icons/web-app-manifest-512x512.png",
  "/icons/favicon-96x96.png",
];

//  API responses cache 
const CACHEABLE_API_PATTERNS = [
  /\/api\/consultants\/$/,
  /\/api\/blogs\/$/,
  /\/api\/blogs\/featured\//,
  /\/api\/assessments\/$/,
  /\/api\/consultants\/specializations\//,
];

// routes cache never 
const NEVER_CACHE_PATTERNS = [
  /\/api\/auth\//,           // auth endpoints
  /\/api\/appointments\//,   // real-time booking data
  /\/api\/push\//,           // push subscriptions
];


// INSTALL — static assets pre-cache

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});


// ACTIVATE — old caches clean up

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) =>
                key !== STATIC_CACHE &&
                key !== DYNAMIC_CACHE &&
                key !== API_CACHE
            )
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});


// FETCH — caching strategies

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Non-GET requests — never cache 
  if (request.method !== "GET") return;

  // Chrome extensions skip
  if (!url.protocol.startsWith("http")) return;

  // Never cache patterns
  if (NEVER_CACHE_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
    event.respondWith(fetch(request));
    return;
  }

  // API requests — Network First, fallback to cache
  if (url.pathname.startsWith("/api/")) {
    const shouldCache = CACHEABLE_API_PATTERNS.some((pattern) =>
      pattern.test(url.pathname)
    );

    if (shouldCache) {
      event.respondWith(networkFirst(request, API_CACHE));
    } else {
      event.respondWith(fetch(request));
    }
    return;
  }

  // Next.js static assets (_next/static) — Cache First
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Next.js image optimization — Cache First
  if (url.pathname.startsWith("/_next/image")) {
    event.respondWith(cacheFirst(request, DYNAMIC_CACHE));
    return;
  }

  // HTML page navigation — Network First, offline fallback
  if (request.mode === "navigate") {
    event.respondWith(navigationHandler(request));
    return;
  }

  // Everything else — Stale While Revalidate
  event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
});


// Caching Strategy Functions


// Cache First — for static assets 
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Network error", { status: 503 });
  }
}

// Network First — for API calls 
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response(JSON.stringify({ error: "Offline" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Stale While Revalidate — for dynamic content 
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  });

  return cached || fetchPromise;
}

// Navigation — for page load 
async function navigationHandler(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Cache 
    const cached = await caches.match(request);
    if (cached) return cached;

    // Offline page 
    return caches.match("/offline.html");
  }
}


// PUSH NOTIFICATIONS

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: "Center for Psychology", body: event.data.text() };
  }

  const options = {
    body: data.body || "You have a new notification",
    icon: data.icon || "/icons/web-app-manifest-192x192.png",
    badge: "/icons/favicon-96x96.png",
    vibrate: [100, 50, 100],
    tag: data.tag || "cph-notification",
    renotify: true,
    data: {
      url: data.url || "/dashboard",
      dateOfArrival: Date.now(),
    },
    actions: [
      { action: "open", title: "Open" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || "Center for Psychology",
      options
    )
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "dismiss") return;

  const url = event.notification.data?.url || "/dashboard";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        return clients.openWindow(url);
      })
  );
});