// Firebase configuration - REPLACE WITH YOUR VALUES FROM FIREBASE CONSOLE
const firebaseConfig = {
  apiKey: "AIzaSyDgk_2BLj-p2bbCNleQZFbI1dzsMH5omzo",
  authDomain: "botwa-99954.firebaseapp.com",
  databaseURL: "https://botwa-99954-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "botwa-99954",
  storageBucket: "botwa-99954.firebasestorage.app",
  messagingSenderId: "1003488855126",
  appId: "1:1003488855126:web:31a4b0938244e11d3c27f7",
  measurementId: "G-4LFXCXK7YG"
};

// Initialize Firebase
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/images/logo.png',
    badge: '/images/favicon-32x32.png',
    data: payload.data,
    actions: [
      { action: 'view', title: 'Lihat' },
      { action: 'dismiss', title: 'Tutup' }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

const CACHE_NAME = 'omega-jastip-v2';
const STATIC_CACHE = 'omega-jastip-static-v2';
const DYNAMIC_CACHE = 'omega-jastip-dynamic-v2';
const API_CACHE = 'omega-jastip-api-v2';

const urlsToCache = [
  '/',
  '/index.html',
  '/pages/resto.html',
  '/pages/toko.html',
  '/pages/services.html',
  '/pages/calculator.html',
  '/pages/app-shell.html',
  '/pages/offline.html',
  '/manifest.json',
  '/css/style.css',
  '/js/script.js',
  '/js/resto.js',
  '/js/toko.js',
  '/js/notifications.js',
  '/js/protection.js',
  '/images/logo.png',
  '/images/android-chrome-192x192.png',
  '/images/android-chrome-512x512.png',
  '/images/favicon-32x32.png',
  '/images/favicon-16x16.png',
  '/images/favicon.ico',
  '/images/apple-touch-icon.png',
  '/images/hero-background.jpg',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Cache resources individually to handle failures gracefully
        const cachePromises = urlsToCache.map(url => {
          return cache.add(url).catch(error => {
            console.warn(`Failed to cache ${url}:`, error);
            // Continue with other resources even if one fails
          });
        });
        return Promise.allSettled(cachePromises);
      })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests and http/https schemes
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Handle different caching strategies
  if (url.pathname.startsWith('/api/')) {
    // API requests - Network first with cache fallback
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful API responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(API_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached API response if network fails
          return caches.match(request);
        })
    );
  } else if (request.destination === 'image' || request.destination === 'font') {
    // Images and fonts - Cache first
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request).then(networkResponse => {
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(STATIC_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
  } else if (request.url.includes('.html') || request.url.includes('.js') || request.url.includes('.css')) {
    // HTML, JS, CSS - Stale while revalidate
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        const fetchPromise = fetch(request).then(networkResponse => {
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(STATIC_CACHE).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });

        return cachedResponse || fetchPromise;
      })
    );
  } else {
    // Default - Cache first with network fallback
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request).then(networkResponse => {
          // Don't cache external requests
          if (!url.hostname.includes('omegajastip.online')) {
            return networkResponse;
          }

          const responseClone = networkResponse.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
          return networkResponse;
        }).catch(() => {
          // Return offline page for navigation requests
          if (request.mode === 'navigate') {
            return caches.match('/pages/offline.html');
          }
        });
      })
    );
  }
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE && cacheName !== API_CACHE) {
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
    try {
      // Try to parse as JSON first
      data = event.data.json();
    } catch (e) {
      // If JSON parsing fails, treat as plain text
      console.log('Push data is not JSON, treating as text:', event.data.text());
      data = {
        title: 'Omega Jastip',
        body: event.data.text()
      };
    }
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

  if (event.action === 'view' || event.action === 'explore') {
    // Open the app
    event.waitUntil(
      self.clients.openWindow('/')
    );
  } else if (event.action === 'dismiss' || event.action === 'close') {
    // Do nothing, notification already closed
  } else {
    // Default action: open the app
    event.waitUntil(
      self.clients.matchAll().then(clientList => {
        const client = clientList.find(c => c.visibilityState === 'visible');
        if (client) {
          client.focus();
        } else {
          self.clients.openWindow('/');
        }
      })
    );
  }
});
