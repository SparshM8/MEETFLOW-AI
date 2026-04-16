const CACHE_NAME = 'meetflow-v2';
const PRE_CACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icons.svg'
];

// 1. Install & Pre-cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRE_CACHE_ASSETS))
  );
  self.skipWaiting();
});

// 2. Activate & Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((k) => k !== CACHE_NAME && caches.delete(k))
    ))
  );
});

/**
 * 3. Stale-While-Revalidate Strategy (Google Best Practice)
 * Serves from cache for instant-on, updates cache in background.
 */
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Clone and update cache with the new version
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        }).catch(() => {
          // Silent catch for network failures (offline)
        });

        return cachedResponse || fetchPromise;
      });
    })
  );
});
