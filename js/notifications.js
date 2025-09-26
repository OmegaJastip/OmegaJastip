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
      // Use the main service worker for FCM
      registration = await navigator.serviceWorker.getRegistration('/');
      if (!registration) {
        registration = await navigator.serviceWorker.register('/sw.js');
      }
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
  // Store token in localStorage for demo purposes
  localStorage.setItem('fcm_token', token);

  
  // Example implementation for actual server call (uncomment if backend available):
  /*
  fetch('/api/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: token, userId: getUserId() }) // Implement getUserId() as needed
  })
  .then(response => response.json())
  .then(data => console.log('Token sent to server:', data))
  .catch(error => console.error('Error sending token:', error));
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
  // Service worker is registered in script.js, no need to register again here

  // Check if user has already granted permission
  if (Notification.permission === 'default') {
    // Check if user has previously denied and it's been less than 24 hours
    const deniedTime = localStorage.getItem('notification-denied');
    if (deniedTime && (Date.now() - parseInt(deniedTime)) < 24 * 60 * 60 * 1000) {
      // Don't show prompt again for 24 hours
      return;
    }
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

  // Enhanced styles with responsiveness and animation
  prompt.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    left: 20px;
    max-width: 350px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    padding: 24px;
    z-index: 10000;
    font-family: 'Poppins', sans-serif;
    transform: translateY(100%);
    transition: transform 0.3s ease-out, opacity 0.3s ease-out;
    opacity: 0;
    @media (max-width: 480px) {
      left: 10px;
      right: 10px;
      bottom: 10px;
      max-width: none;
    }
  `;

  // Button styles
  const allowBtn = prompt.querySelector('#allow-notifications');
  const denyBtn = prompt.querySelector('#deny-notifications');
  if (allowBtn) {
    allowBtn.style.cssText = `
      background: #ee4d2d;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      margin-right: 8px;
      transition: background 0.2s ease;
    `;
    allowBtn.addEventListener('mouseenter', () => { allowBtn.style.background = '#d43c1e'; });
    allowBtn.addEventListener('mouseleave', () => { allowBtn.style.background = '#ee4d2d'; });
  }
  if (denyBtn) {
    denyBtn.style.cssText = `
      background: #f3f4f6;
      color: #6b7280;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s ease;
    `;
    denyBtn.addEventListener('mouseenter', () => { denyBtn.style.background = '#e5e7eb'; });
    denyBtn.addEventListener('mouseleave', () => { denyBtn.style.background = '#f3f4f6'; });
  }

  // Content styles
  const content = prompt.querySelector('.notification-prompt-content');
  if (content) {
    content.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
    `;
  }
  const icon = prompt.querySelector('.prompt-icon');
  if (icon) {
    icon.style.cssText = `
      font-size: 24px;
      flex-shrink: 0;
    `;
  }
  const text = prompt.querySelector('.prompt-text');
  if (text) {
    text.style.cssText = `
      flex: 1;
    `;
  }
  const buttons = prompt.querySelector('.prompt-buttons');
  if (buttons) {
    buttons.style.cssText = `
      display: flex;
      gap: 8px;
      flex-shrink: 0;
    `;
  }
  const h4 = prompt.querySelector('h4');
  if (h4) {
    h4.style.cssText = `
      margin: 0 0 4px 0;
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
    `;
  }
  const p = prompt.querySelector('p');
  if (p) {
    p.style.cssText = `
      margin: 0;
      font-size: 14px;
      color: #6b7280;
      line-height: 1.4;
    `;
  }

  document.body.appendChild(prompt);

  // Animate in
  setTimeout(() => {
    prompt.style.opacity = '1';
    prompt.style.transform = 'translateY(0)';
  }, 100);

  // Handle buttons
  document.getElementById('allow-notifications').addEventListener('click', async () => {
    const token = await requestNotificationPermission();
    if (token) {
      showSuccessMessage();
    }
    // Animate out
    prompt.style.opacity = '0';
    prompt.style.transform = 'translateY(100%)';
    setTimeout(() => prompt.remove(), 300);
  });

  document.getElementById('deny-notifications').addEventListener('click', () => {
    // Animate out
    prompt.style.opacity = '0';
    prompt.style.transform = 'translateY(100%)';
    setTimeout(() => {
      prompt.remove();
      // Remember choice for 24 hours
      localStorage.setItem('notification-denied', Date.now().toString());
    }, 300);
  });

  // Close on outside click (optional)
  prompt.addEventListener('click', (e) => {
    if (e.target === prompt) {
      document.getElementById('deny-notifications').click();
    }
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

// Test notification function
function showTestNotification() {
  if (Notification.permission === 'granted') {
    const notification = new Notification('Test Notifikasi Omega Jastip', {
      body: 'Ini adalah notifikasi test untuk memastikan sistem notifikasi berfungsi dengan baik.',
      icon: '/images/logo.png',
      badge: '/images/favicon-32x32.png',
      tag: 'test-notification'
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);
  } else {
    alert('Notifikasi belum diizinkan. Klik "Izinkan" pada prompt notifikasi untuk mengaktifkan.');
  }
}

// Export functions
window.NotificationManager = {
  init: initNotifications,
  requestPermission: requestNotificationPermission,
  getToken: getFCMToken,
  testNotification: showTestNotification
};

