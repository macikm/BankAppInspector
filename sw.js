// BankApp Inspector Service Worker
const CACHE_NAME = 'bankapp-inspector-v1';
const STATIC_ASSETS = [
  './BankAppInspector.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon.svg',
  './favicon-32.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Bypass cache completely for API calls, auth tokens, telemetry, and non-GET requests
  if (
    req.method !== 'GET' ||
    url.pathname.includes('/api/') ||
    url.pathname.includes('/connect/') ||
    url.pathname.includes('/swagger') ||
    url.pathname.includes('/Logs') ||
    url.searchParams.has('filter')
  ) {
    return;
  }

  // Network-first strategy for HTML documents to always get latest version when online
  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return networkRes;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('./BankAppInspector.html')))
    );
    return;
  }

  // Cache-first strategy for local static assets (icons, manifest)
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cachedRes) => {
        if (cachedRes) return cachedRes;
        return fetch(req).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const clone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return networkRes;
        });
      })
    );
    return;
  }

  // Fallback to network
  event.respondWith(fetch(req));
});
