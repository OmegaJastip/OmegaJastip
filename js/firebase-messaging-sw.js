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

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
  // For dismiss action, do nothing (notification already closed)
});
