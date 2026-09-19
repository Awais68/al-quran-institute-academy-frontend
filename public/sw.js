const CACHE_NAME = 'al-quran-institute-v2';
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[Service Worker] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

// Fetch handler.
//
// Rule: this worker only ever caches *public, same-origin* assets. It used to
// treat anything whose URL did not contain "/api/" as a static asset, which
// meant authenticated backend responses (the backend is on another origin and
// has no "/api/" prefix) were cached and replayed — on a shared device the next
// user could be served the previous user's data.
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only GETs are cacheable.
  if (request.method !== 'GET') return;

  // Skip chrome extensions and other non-http(s) requests.
  if (!request.url.startsWith('http')) return;

  const url = new URL(request.url);

  // Cross-origin (backend API, Cloudinary, analytics): never touch it. Let the
  // network handle it so nothing personal lands in the cache.
  if (url.origin !== self.location.origin) return;

  // Same-origin route handlers are dynamic — network only.
  if (url.pathname.startsWith('/api/')) return;

  // Navigations: network first so a deploy is picked up immediately, with the
  // offline page as the fallback. HTML is never served stale from cache.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(request).then((cached) => cached || caches.match('/offline')))
    );
    return;
  }

  // Static assets (_next/static, images, fonts, manifest): cache first with a
  // background refresh.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => cached || new Response('Network error', {
          status: 408,
          headers: { 'Content-Type': 'text/plain' },
        }));

      return cached || network;
    })
  );
});

// Logout tells the worker to drop everything it holds, so nothing survives into
// the next session on a shared device.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((names) => Promise.all(names.map((name) => caches.delete(name))))
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  try {
    // Implement data synchronization logic here
    console.log('[Service Worker] Syncing offline data...');
    // You can sync queued API calls, form submissions, etc.
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'New notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Al-Quran Institute', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
