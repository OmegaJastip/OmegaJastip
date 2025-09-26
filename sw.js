const CACHE_NAME = 'omega-jastip-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/resto.html',
  '/toko.html',
  '/manifest.json',
  '/css/style.css',
  '/css/resto.css',
  '/css/toko.css',
  '/js/script.js',
  '/js/resto.js',
  '/js/toko.js',
  '/js/protection.js',
  '/images/logo.png',
  '/images/android-chrome-192x192.png',
  '/images/android-chrome-512x512.png',
  '/images/favicon-32x32.png',
  '/images/favicon-16x16.png',
  '/images/favicon.ico',
  '/images/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle push notifications
self.addEventListener('push', event => {
  console.log('Push message received:', event);

  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.body || 'Ada update baru dari Omega Jastip!',
    icon: '/images/logo.png',
    badge: '/images/favicon-32x32.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Lihat',
        icon: '/images/favicon-16x16.png'
      },
      {
        action: 'close',
        title: 'Tutup'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Omega Jastip', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Notification click received:', event);

  event.notification.close();

  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  } else {
    // Default action: open the app
    event.waitUntil(
      clients.matchAll().then(clients => {
        const client = clients.find(c => c.visibilityState === 'visible');
        if (client) {
          client.focus();
        } else {
          clients.openWindow('/');
        }
      })
    );
  }
});
