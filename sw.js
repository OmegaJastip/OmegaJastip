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
