/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'million-platform-v1';
const OFFLINE_URL = '/offline';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
];

// Cache strategies
const CACHE_FIRST_ASSETS = [
  /\.(js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|webp)$/i,
];

const NETWORK_FIRST_ASSETS = [
  /\/api\//,
  /\/_next\/data\//,
];

// Install event - precache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching assets');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests
  if (url.origin !== self.location.origin) return;

  // Network-first for API calls
  if (NETWORK_FIRST_ASSETS.some((pattern) => pattern.test(url.pathname))) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache-first for static assets
  if (CACHE_FIRST_ASSETS.some((pattern) => pattern.test(url.pathname))) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Stale-while-revalidate for pages
  event.respondWith(staleWhileRevalidate(request));
});

// Cache-first strategy
async function cacheFirst(request: Request): Promise<Response> {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

// Network-first strategy
async function networkFirst(request: Request): Promise<Response> {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request: Request): Promise<Response> {
  const cache = await caches.open(CACHE_NAME);
  const cached = await caches.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached || caches.match(OFFLINE_URL));

  return cached || fetchPromise as Promise<Response>;
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data?.type === 'CACHE_URLS') {
    const urls = event.data.urls as string[];
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(urls);
    });
  }

  if (event.data?.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME);
  }
});

// Background sync for offline submissions
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'sync-submissions') {
    event.waitUntil(syncOfflineSubmissions());
  }
});

async function syncOfflineSubmissions() {
  // Get pending submissions from IndexedDB and sync them
  console.log('[SW] Syncing offline submissions');
  // Implementation would use IndexedDB to get/send pending items
}

// Push notification handler
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const { notification } = data;

  const options: NotificationOptions = {
    body: notification.body,
    icon: notification.icon || '/logo_new.jpeg',
    badge: notification.badge || '/badge.png',
    data: notification.data,
    dir: notification.dir || 'rtl',
    lang: notification.lang || 'ar',
  };

  event.waitUntil(
    self.registration.showNotification(notification.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});

export {};
