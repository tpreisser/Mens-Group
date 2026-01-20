// Service Worker for Same Battles PWA
// Enables offline functionality and caching

// Detect base path from service worker location
const getBasePath = () => {
  const swPath = self.location.pathname;
  if (swPath.includes('/Mens-Group/')) {
    return '/Mens-Group/';
  }
  return '/';
};

const BASE_PATH = getBasePath();
// Force cache clear - increment version number to invalidate all old caches
const CACHE_NAME = 'same-battles-v5-cache-bust-' + new Date().getTime();
const urlsToCache = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'css/styles.css',
  BASE_PATH + 'js/app.js',
  BASE_PATH + 'manifest.json',
  BASE_PATH + 'assets/logo/same-battles-logo.webp',
  BASE_PATH + 'weeks/week-01.html',
  BASE_PATH + 'weeks/week-02.html',
  BASE_PATH + 'weeks/week-03.html',
  BASE_PATH + 'weeks/week-04.html',
  BASE_PATH + 'weeks/week-05.html',
  BASE_PATH + 'weeks/week-06.html',
  BASE_PATH + 'weeks/week-07.html',
  BASE_PATH + 'weeks/week-08.html',
  BASE_PATH + 'weeks/week-09.html',
  BASE_PATH + 'weeks/week-10.html',
  BASE_PATH + 'weeks/week-11.html',
  BASE_PATH + 'weeks/week-12.html'
];

// Install event - cache resources but skip waiting to activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    // Delete all old caches first
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('same-battles-') && cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Then cache new resources
      return caches.open(CACHE_NAME)
        .then((cache) => {
          // Try to cache all URLs, but don't fail if some fail
          return Promise.allSettled(
            urlsToCache.map(url => 
              cache.add(url).catch(err => {
                console.log('Failed to cache:', url, err);
                return null;
              })
            )
          );
        })
        .catch((error) => {
          console.log('Cache install failed:', error);
        });
    })
  );
  // Skip waiting to activate immediately and clear old cache
  self.skipWaiting();
});

// Listen for skip waiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Activate event - clean up ALL old caches to force fresh content
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      // Delete ALL old caches - force complete refresh
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete all same-battles caches except the current one
          if (cacheName.startsWith('same-battles-') && cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Force all clients to reload with new cache
      return self.clients.claim();
    })
  );
});

// Fetch event - ALWAYS network first to get fresh content, bypass cache
self.addEventListener('fetch', (event) => {
  // Network first strategy for ALL requests to always get fresh content
  event.respondWith(
    fetch(event.request, { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
      .then((response) => {
        // Only cache for offline use, but always fetch fresh from network
        if (response.status === 200 && !event.request.url.includes('/assets/audio/')) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Only use cache if network completely fails (offline mode)
        return caches.match(event.request).then((cached) => {
          if (cached) {
            return cached;
          }
          // If cache also fails and it's a document request, return index
          if (event.request.destination === 'document') {
            return caches.match(BASE_PATH + 'index.html');
          }
        });
      })
  );
});
