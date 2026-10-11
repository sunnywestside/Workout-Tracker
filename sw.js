const CACHE_NAME = 'workout-ml-v8-vicecity-palette';
const STATIC_ASSETS = [
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only intercept same-origin requests or explicitly approved CDNs
  const url = new URL(event.request.url);
  const isApproved = url.origin === self.location.origin || url.origin === 'https://cdn.jsdelivr.net';

  if (!isApproved) {
    return; // Pass through to network directly without cache interference
  }

  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
