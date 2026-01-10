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
const CACHE_NAME = 'same-battles-v2';
const urlsToCache = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'css/styles.css',
  BASE_PATH + 'js/app.js',
  BASE_PATH + 'manifest.json',
  BASE_PATH + 'assets/logo/same-battles-logo.png',
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

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
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
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete all old same-battles caches
          if (cacheName.startsWith('same-battles-') && !cacheName.startsWith('same-battles-v2-')) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - network first for HTML, cache first for assets
self.addEventListener('fetch', (event) => {
  // Network first strategy for HTML pages to always get fresh content
  if (event.request.destination === 'document' || event.request.url.includes('.html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful HTML responses for offline
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
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
  } else {
    // Cache first for assets (images, CSS, JS)
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return cached version or fetch from network
          return response || fetch(event.request).then((response) => {
            // Don't cache audio files (they're large)
            if (event.request.url.includes('/assets/audio/')) {
              return response;
            }
            
            // Cache successful responses
            if (response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            
            return response;
          });
        })
        .catch(() => {
          // If both cache and network fail, return offline page for documents
          if (event.request.destination === 'document') {
            return caches.match(BASE_PATH + 'index.html');
          }
        })
    );
  }
});
