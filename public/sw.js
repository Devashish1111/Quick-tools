const CACHE_NAME = 'kwiktoolbox-v1';
const PRECACHE_URLS = [
  '/',
  '/offline',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('/api/')) return;
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchRes) => {
        return caches.open(CACHE_NAME).then((cache) => {
          if (event.request.url.startsWith('http')) {
            cache.put(event.request, fetchRes.clone());
          }
          return fetchRes;
        });
      });
    }).catch(() => {
      // Offline fallback for HTML
      if (event.request.headers.get('accept').includes('text/html')) {
        return caches.match('/offline');
      }
    })
  );
});
