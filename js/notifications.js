// Firebase is already initialized in index.html
const fcmMessaging = window.firebaseMessaging;

// Request notification permission and subscribe user
async function requestNotificationPermission() {
  try {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      return null;
    }

    // Check current permission
    if (Notification.permission === 'granted') {
      return await getFCMToken();
    }

    if (Notification.permission === 'denied') {
      return null;
    }

    // Request permission
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      return await getFCMToken();
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

// Get FCM token
async function getFCMToken() {
  try {
    let registration;

    if ('serviceWorker' in navigator) {
      registration = await navigator.serviceWorker.register('firebase-messaging-sw.js');
    }

    const token = await fcmMessaging.getToken({
      vapidKey: 'BBHZYHIRY2KMLJvhU2QBMC4ElGLCd13_dZS3ssVjwWsk1i3hITvlrS172cxhGpu3-gvyVKQVfGW6G1GIx7v70QQ', // REPLACE WITH YOUR VAPID KEY FROM FIREBASE CONSOLE -> Cloud Messaging -> Web Push certificates
      serviceWorkerRegistration: registration
    });

    if (token) {
      // Send token to your server for storing and sending notifications
      sendToServer(token);
      return token;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

// Function to send token to server (implement based on your backend)
function sendToServer(token) {
  // Example implementation - replace with your server endpoint
  // For now, just log it. In production, send to your backend API

  // Uncomment and modify for actual server call:
  /*
  fetch('/api/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: token, userId: 'user_id_here' })
  })
  .then(response => response.json())
  .then(data => {})
  .catch(error => {});
  */
}

// Handle foreground messages (when app is open)
fcmMessaging.onMessage((payload) => {

  // Show notification even when app is open
  if (Notification.permission === 'granted') {
    const notification = new Notification(payload.notification.title, {
      body: payload.notification.body,
      icon: '/images/logo.png',
      badge: '/images/favicon-32x32.png',
      data: payload.data
    });

    notification.onclick = () => {
      // Focus the app window
      window.focus();
      notification.close();
    };
  }
});

// Initialize notifications
function initNotifications() {
  // Register service worker first
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('firebase-messaging-sw.js')
      .then((registration) => {
      })
      .catch((error) => {
      });
  }

  // Check if user has already granted permission
  if (Notification.permission === 'default') {
    // Show notification prompt after a delay
    setTimeout(() => {
      showNotificationPrompt();
    }, 5000); // 5 seconds after page load
  } else if (Notification.permission === 'granted') {
    // Already granted, get token
    requestNotificationPermission();
  }
}

// Show custom notification prompt UI
function showNotificationPrompt() {
  // Create prompt element
  const prompt = document.createElement('div');
  prompt.id = 'notification-prompt';
  prompt.innerHTML = `
    <div class="notification-prompt-content">
      <div class="prompt-icon">🔔</div>
      <div class="prompt-text">
        <h4>Dapatkan Notifikasi</h4>
        <p>Dapatkan update terbaru tentang layanan jastip dan promo menarik!</p>
      </div>
      <div class="prompt-buttons">
        <button id="allow-notifications" class="btn-prompt">Izinkan</button>
        <button id="deny-notifications" class="btn-prompt btn-secondary">Nanti</button>
      </div>
    </div>
  `;

  // Add styles
  prompt.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    padding: 20px;
    max-width: 300px;
    z-index: 10000;
    font-family: 'Poppins', sans-serif;
  `;

  document.body.appendChild(prompt);

  // Handle buttons
  document.getElementById('allow-notifications').addEventListener('click', async () => {
    const token = await requestNotificationPermission();
    if (token) {
      showSuccessMessage();
    }
    prompt.remove();
  });

  document.getElementById('deny-notifications').addEventListener('click', () => {
    prompt.remove();
    // Remember choice for 24 hours
    localStorage.setItem('notification-denied', Date.now().toString());
  });
}

// Show success message
function showSuccessMessage() {
  const message = document.createElement('div');
  message.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      font-family: 'Poppins', sans-serif;
    ">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span>✅</span>
        <span>Notifikasi diaktifkan!</span>
      </div>
    </div>
  `;

  document.body.appendChild(message);

  setTimeout(() => {
    message.remove();
  }, 3000);
}

// Export functions
window.NotificationManager = {
  init: initNotifications,
  requestPermission: requestNotificationPermission,
  getToken: getFCMToken
};

