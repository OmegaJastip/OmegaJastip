// Import Firebase messaging from config
import { firebaseMessaging } from './firebase-config.js';
import { onMessage, getToken } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-messaging.js";
const fcmMessaging = firebaseMessaging;

// Save original console before protection.js overrides it
const originalConsole = window.console;

// Request notification permission and subscribe user
async function requestNotificationPermission() {
  try {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      originalConsole.warn('Notifications not supported in this browser.');
      alert('Notifikasi tidak didukung oleh browser Anda.');
      return null;
    }

    // Check current permission
    if (Notification.permission === 'granted') {
      return await getFCMToken();
    }

    if (Notification.permission === 'denied') {
      originalConsole.warn('Notification permission was previously denied.');
      alert('Anda telah menolak izin notifikasi. Silakan izinkan notifikasi di pengaturan browser Anda untuk menerima update.');
      return null;
    }

    // Request permission
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      return await getFCMToken();
    } else if (permission === 'denied') {
      originalConsole.warn('Notification permission denied by user.');
      alert('Anda menolak izin notifikasi. Anda tidak akan menerima update notifikasi.');
      return null;
    } else {
      originalConsole.warn('Notification permission request dismissed.');
      return null;
    }
  } catch (error) {
    originalConsole.error('Error requesting notification permission:', error);
    return null;
  }
}

// Get FCM token
async function getFCMToken() {
  try {
    originalConsole.log('🔑 Attempting to get FCM token...');

    if (!('serviceWorker' in navigator)) {
      originalConsole.error('❌ Service Worker not supported in this browser');
      return null;
    }

    originalConsole.log('🔧 Checking service worker registration...');

    // Wait for any existing service worker to be ready
    let registration = await navigator.serviceWorker.ready;
    originalConsole.log('✅ Service worker is ready');

    // If no active service worker, register one
    if (!registration.active) {
      originalConsole.log('📝 No active service worker, registering new one...');
      registration = await navigator.serviceWorker.register('/sw.js');
      originalConsole.log('✅ Service worker registered, waiting for activation...');

      // Wait for the service worker to be activated
      await new Promise((resolve) => {
        const checkState = () => {
          if (registration.active) {
            resolve();
          } else {
            setTimeout(checkState, 100);
          }
        };
        checkState();
      });
      originalConsole.log('✅ Service worker activated successfully');
    } else {
      originalConsole.log('✅ Active service worker found');
    }

    // Ensure the service worker is controlling this page
    if (!navigator.serviceWorker.controller) {
      originalConsole.log('🔄 Service worker not controlling page, refreshing registration...');
      // Force refresh the registration
      registration = await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' });
      await navigator.serviceWorker.ready;
    }

    originalConsole.log('🔐 Requesting FCM token from Firebase...');
    const token = await getToken(fcmMessaging, {
      vapidKey: 'BBHZYHIRY2KMLJvhU2QBMC4ElGLCd13_dZS3ssVjwWsk1i3hITvlrS172cxhGpu3-gvyVKQVfGW6G1GIx7v70QQ', // REPLACE WITH YOUR VAPID KEY FROM FIREBASE CONSOLE -> Cloud Messaging -> Web Push certificates
      serviceWorkerRegistration: registration
    });

    if (token) {
      originalConsole.log('🎉 FCM token obtained successfully:', token.substring(0, 50) + '...');
      // Send token to your server for storing and sending notifications
      sendToServer(token);
      return token;
    } else {
      originalConsole.warn('⚠️ No FCM token received from Firebase');
      return null;
    }
  } catch (error) {
    originalConsole.error('❌ Error getting FCM token:', error);
    return null;
  }
}

// Function to send token to server (implement based on your backend)
function sendToServer(token) {
  // Store token in localStorage for demo purposes
  localStorage.setItem('fcm_token', token);

  // Also store in subscribed tokens array for broadcast simulation
  const subscribedTokens = JSON.parse(localStorage.getItem('subscribed_tokens') || '[]');
  const tokenData = {
    token: token,
    subscribedAt: new Date().toISOString(),
    userAgent: navigator.userAgent
  };

  // Check if token already exists
  const existingIndex = subscribedTokens.findIndex(t => t.token === token);
  if (existingIndex === -1) {
    subscribedTokens.push(tokenData);
    localStorage.setItem('subscribed_tokens', JSON.stringify(subscribedTokens));
    originalConsole.log('Token added to subscribed users list');
  }

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

// Send push notification to subscribed users (requires server-side implementation)
function sendPushNotification(title, body, targetTokens = null) {
  // This is a placeholder for server-side push notification sending
  // In a real implementation, you would send this data to your server
  // which would then use Firebase Admin SDK to send the notification

  const payload = {
    title: title || 'Omega Jastip',
    body: body || 'Ada update baru dari Omega Jastip!',
    icon: '/images/logo.png',
    badge: '/images/favicon-32x32.png'
  };

  // For demo purposes, if no targetTokens provided, send to current user
  if (!targetTokens) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon,
        badge: payload.badge
      });
    }
    return;
  }

  // Placeholder for server request
  // In production, replace with actual server endpoint
  originalConsole.log('Sending push notification to server:', { payload, targetTokens });

  // Example fetch request (commented out as no server exists)
  /*
  fetch('/api/send-notification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: payload.title,
      body: payload.body,
      tokens: targetTokens
    })
  })
  .then(response => response.json())
  .then(data => console.log('Notification sent:', data))
  .catch(error => console.error('Error sending notification:', error));
  */
}

// Handle foreground messages (when app is open)
if (fcmMessaging) {
  onMessage(fcmMessaging, (payload) => {

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
}

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
  } else if (Notification.permission === 'denied') {
    // User denied notification permission
    // Set a reminder to prompt again after some minutes (e.g., 10 minutes)
    const reminderDelayMs = 10 * 60 * 1000; // 10 minutes
    const lastDeniedTime = localStorage.getItem('notification-denied-time');
    const now = Date.now();

    if (!lastDeniedTime || now - parseInt(lastDeniedTime) > reminderDelayMs) {
      // Save the time of denial
      localStorage.setItem('notification-denied-time', now.toString());

      // Show PWA install prompt and GPS reminder
      showPWAInstallPrompt();
      showGPSReminder();

      // Set timeout to remind user again after reminderDelayMs
      setTimeout(() => {
        // Clear the denial time to allow prompt again
        localStorage.removeItem('notification-denied-time');
        // Show notification prompt again
        showNotificationPrompt();
      }, reminderDelayMs);
    }
  }
}

// Show PWA install prompt
function showPWAInstallPrompt() {
  // This is a placeholder for PWA install prompt logic
  // You can customize this to trigger your PWA install UI
  originalConsole.log('Prompting user to install PWA...');
  alert('Install aplikasi Omega Jastip untuk pengalaman terbaik!');
}

// Show GPS reminder prompt
function showGPSReminder() {
  // This is a placeholder for GPS reminder logic
  // You can customize this to remind user to enable GPS/location services
  originalConsole.log('Reminding user to enable GPS/location services...');
  alert('Aktifkan GPS Anda untuk mendapatkan layanan jastip yang lebih akurat!');
}

// Show custom notification prompt UI
function showNotificationPrompt() {
  let prompt = document.getElementById('notification-prompt');

  if (!prompt) {
    // Create prompt element if it doesn't exist
    prompt = document.createElement('div');
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

    // Enhanced styles with desktop/mobile responsiveness
    const isDesktop = window.innerWidth > 768;
    prompt.style.cssText = `
      position: fixed;
      bottom: 20px;
      ${isDesktop ? 'right: 20px; left: auto; max-width: 380px; margin: 0;' : 'left: 20px; right: 20px; max-width: 350px; margin: 0 auto;'}
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      padding: ${isDesktop ? '24px' : '20px'};
      z-index: 10000;
      font-family: 'Poppins', sans-serif;
      transform: translateY(100%);
      transition: transform 0.3s ease-out, opacity 0.3s ease-out;
      opacity: 0;
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
  }

  // Handle buttons (attach listeners whether created or existing)
  const allowBtn = document.getElementById('allow-notifications');
  const denyBtn = document.getElementById('deny-notifications');

  if (allowBtn) {
    allowBtn.addEventListener('click', async () => {
      const token = await requestNotificationPermission();
      if (token) {
        showSuccessMessage();
      }
      // Animate out
      prompt.style.opacity = '0';
      prompt.style.transform = 'translateY(100%)';
      setTimeout(() => prompt.remove(), 300);
    });
  }

  if (denyBtn) {
    denyBtn.addEventListener('click', () => {
      // Animate out
      prompt.style.opacity = '0';
      prompt.style.transform = 'translateY(100%)';
      setTimeout(() => {
        prompt.remove();
        // Remember choice for 24 hours
        localStorage.setItem('notification-denied', Date.now().toString());
      }, 300);
    });
  }

  // Close on outside click (optional)
  prompt.addEventListener('click', (e) => {
    if (e.target === prompt) {
      denyBtn && denyBtn.click();
    }
  });
}

  // Show success message
  function showSuccessMessage() {
    const isDesktop = window.innerWidth > 768;
    const message = document.createElement('div');
    message.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        ${isDesktop ? 'right: 20px;' : 'left: 20px; right: 20px; margin: 0 auto; max-width: 300px; text-align: center;'}
        background: #10b981;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: 'Poppins', sans-serif;
      ">
        <div style="display: flex; align-items: center; justify-content: ${isDesktop ? 'flex-start' : 'center'}; gap: 10px;">
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

// Test notification function (broadcast to all subscribed users)
function showTestNotification() {
  // Get all stored FCM tokens (simulating subscribed users)
  const storedTokens = JSON.parse(localStorage.getItem('subscribed_tokens') || '[]');

  if (storedTokens.length === 0) {
    // If no tokens stored, just show to current user
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
    return;
  }

  // Broadcast to all subscribed users (simulated)
  originalConsole.log(`Broadcasting test notification to ${storedTokens.length} subscribed users...`);

  // In a real implementation, this would send to server
  // For demo, we'll show multiple notifications to simulate broadcast
  storedTokens.forEach((tokenData, index) => {
    setTimeout(() => {
      if (Notification.permission === 'granted') {
        const notification = new Notification('Test Broadcast - Omega Jastip', {
          body: `Notifikasi test broadcast ke user ${index + 1}/${storedTokens.length}. Sistem notifikasi berfungsi dengan baik!`,
          icon: '/images/logo.png',
          badge: '/images/favicon-32x32.png',
          tag: `broadcast-test-${index}`
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        // Auto close after 5 seconds
        setTimeout(() => {
          notification.close();
        }, 5000);
      }
    }, index * 1000); // Stagger notifications by 1 second each
  });

  // Show confirmation
  alert(`Test notification dikirim ke ${storedTokens.length} user yang subscribe!`);
}

// New function to trigger a single test notification immediately
function triggerImmediateTestNotification() {
  if (Notification.permission === 'granted') {
    const notification = new Notification('Test Notifikasi Langsung - Omega Jastip', {
      body: 'Ini adalah notifikasi test langsung untuk memastikan sistem notifikasi berfungsi dengan baik.',
      icon: '/images/logo.png',
      badge: '/images/favicon-32x32.png',
      tag: 'immediate-test-notification'
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

// Scheduled notifications system
class ScheduledNotificationManager {
  constructor() {
    this.scheduledNotifications = this.loadScheduledNotifications();
    this.initScheduledNotifications();
  }

  // Load scheduled notifications from localStorage
  loadScheduledNotifications() {
    try {
      const stored = localStorage.getItem('scheduled-notifications');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      originalConsole.error('Error loading scheduled notifications:', error);
      return [];
    }
  }

  // Save scheduled notifications to localStorage
  saveScheduledNotifications() {
    try {
      localStorage.setItem('scheduled-notifications', JSON.stringify(this.scheduledNotifications));
    } catch (error) {
      originalConsole.error('Error saving scheduled notifications:', error);
    }
  }

  // Schedule a notification
  scheduleNotification(title, options, delayMs, id = null) {
    if (!('Notification' in window)) {
      originalConsole.warn('Notifications not supported in this browser');
      return null;
    }
    if (Notification.permission !== 'granted') {
      originalConsole.warn('Notification permission not granted');
      return null;
    }

    const notificationId = id || `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const scheduledTime = Date.now() + delayMs;

    const scheduledNotification = {
      id: notificationId,
      title,
      options: {
        ...options,
        icon: options.icon || '/images/logo.png',
        badge: options.badge || '/images/favicon-32x32.png',
        tag: options.tag || notificationId
      },
      scheduledTime,
      delayMs
    };

    this.scheduledNotifications.push(scheduledNotification);
    this.saveScheduledNotifications();

    // Schedule the notification
    this.scheduleNotificationTimeout(scheduledNotification);

    return notificationId;
  }

  // Schedule notification timeout
  scheduleNotificationTimeout(notification) {
    const delay = notification.scheduledTime - Date.now();

    if (delay > 0) {
      // Schedule in main thread
      setTimeout(() => {
        this.showScheduledNotification(notification);
      }, delay);

      // Also send to service worker for background scheduling
      this.sendToServiceWorker(notification);
    } else {
      // If delay is negative (past due), show immediately
      this.showScheduledNotification(notification);
    }
  }

  // Send scheduled notification to service worker
  sendToServiceWorker(notification) {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SCHEDULE_NOTIFICATION',
        title: notification.title,
        options: notification.options,
        delayMs: notification.delayMs,
        id: notification.id
      });
    }
  }

  // Show scheduled notification
  showScheduledNotification(notification) {
    try {
      const n = new Notification(notification.title, notification.options);

      n.onclick = () => {
        window.focus();
        n.close();
      };

      // Remove from scheduled list after showing
      this.removeScheduledNotification(notification.id);

      // Auto close after 10 seconds
      setTimeout(() => {
        n.close();
      }, 10000);
    } catch (error) {
      console.error('Error showing scheduled notification:', error);
    }
  }

  // Remove scheduled notification
  removeScheduledNotification(id) {
    this.scheduledNotifications = this.scheduledNotifications.filter(n => n.id !== id);
    this.saveScheduledNotifications();
  }

  // Load scheduled notifications from JSON file
  async loadScheduledNotificationsFromJSON() {
    try {
      const response = await fetch('../data/notifications.json');
      if (!response.ok) {
        console.warn('Failed to load notifications.json:', response.status);
        return;
      }
      const notificationsData = await response.json();

      notificationsData.forEach(notificationData => {
        // Check if notification with this ID already exists
        const existingNotification = this.scheduledNotifications.find(n => n.id === notificationData.id);
        if (!existingNotification) {
          // Schedule the notification from JSON
          this.scheduleNotification(
            notificationData.title,
            notificationData.options || {},
            notificationData.delayMs,
            notificationData.id
          );
        }
      });
    } catch (error) {
      console.error('Error loading scheduled notifications from JSON:', error);
    }
  }

  // Initialize scheduled notifications on page load
  async initScheduledNotifications() {
    // Clear any existing scheduled notifications in memory and localStorage
    this.scheduledNotifications = [];
    this.saveScheduledNotifications();

    // Load and schedule notifications from JSON file only
    await this.loadScheduledNotificationsFromJSON();
  }

  // Remove the scheduleDefaultNotifications method entirely

  // Get all scheduled notifications
  getScheduledNotifications() {
    return this.scheduledNotifications;
  }

  // Clear all scheduled notifications
  clearAllScheduledNotifications() {
    this.scheduledNotifications = [];
    this.saveScheduledNotifications();
  }
}

// Initialize scheduled notification manager
const scheduledNotificationManager = new ScheduledNotificationManager();

// Show welcome notification
function showWelcomeNotification() {
  if (!('Notification' in window)) {
    originalConsole.warn('Notifications not supported in this browser');
    alert('Notifikasi tidak didukung oleh browser Anda.');
    return;
  }

  if (Notification.permission !== 'granted') {
    originalConsole.warn('Notification permission not granted');
    alert('Notifikasi belum diizinkan. Klik "Izinkan" pada prompt notifikasi untuk mengaktifkan.');
    return;
  }

  // Use NotificationManager's sendPushNotification for consistency
  window.NotificationManager.sendPushNotification(
    'Selamat Datang di Omega Jastip! 🎉',
    'Terima kasih telah mengunjungi website kami. Dapatkan layanan jastip terbaik di Lubuk Linggau!'
  );

  originalConsole.log('Welcome notification sent via NotificationManager');
}

// Schedule a simple notification (different from the manager's scheduleNotification)
function scheduleNotification() {
  if (!('Notification' in window)) {
    originalConsole.warn('Notifications not supported in this browser');
    alert('Notifikasi tidak didukung oleh browser Anda.');
    return;
  }

  if (Notification.permission !== 'granted') {
    originalConsole.warn('Notification permission not granted');
    alert('Notifikasi belum diizinkan. Klik "Izinkan" pada prompt notifikasi untuk mengaktifkan.');
    return;
  }

  originalConsole.log('Scheduling notification in 5 seconds...');

  setTimeout(() => {
    const notification = new Notification('Notifikasi Terjadwal', {
      body: 'Ini adalah notifikasi yang dijadwalkan 5 detik yang lalu!',
      icon: '/images/logo.png',
      badge: '/images/favicon-32x32.png',
      tag: 'scheduled-test-notification'
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto close after 8 seconds
    setTimeout(() => {
      notification.close();
    }, 8000);

    originalConsole.log('Scheduled notification displayed');
  }, 5000);
}

// Show notification with options object (for compatibility with test page)
function showNotification(options) {
  if (!('Notification' in window)) {
    originalConsole.warn('Notifications not supported in this browser');
    return;
  }

  if (Notification.permission !== 'granted') {
    originalConsole.warn('Notification permission not granted');
    return;
  }

  const notification = new Notification(options.title || 'Omega Jastip', {
    body: options.body || 'Ada update baru dari Omega Jastip!',
    icon: options.icon || '/images/logo.png',
    badge: options.badge || '/images/favicon-32x32.png',
    tag: options.tag || 'notification',
    requireInteraction: options.requireInteraction || false,
    actions: options.actions || []
  });

  notification.onclick = () => {
    window.focus();
    notification.close();
  };

  // Auto close after specified time or default 10 seconds
  setTimeout(() => {
    notification.close();
  }, options.timeout || 10000);

  originalConsole.log('Notification displayed:', options.title);
}

window.triggerImmediateTestNotification = function() {
  if (Notification.permission === 'granted') {
    const notification = new Notification('Test Notifikasi Langsung - Omega Jastip', {
      body: 'Ini adalah notifikasi test langsung untuk memastikan sistem notifikasi berfungsi dengan baik.',
      icon: '/images/logo.png',
      badge: '/images/favicon-32x32.png',
      tag: 'immediate-test-notification'
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
};

// Export functions
window.NotificationManager = {
  init: initNotifications,
  requestPermission: requestNotificationPermission,
  getToken: getFCMToken,
  testNotification: showTestNotification,
  sendPushNotification: sendPushNotification,
  showNotification: showNotification,
  showWelcomeNotification: showWelcomeNotification,
  scheduleNotification: scheduleNotification,

  // Scheduled notification functions
  scheduleNotificationAdvanced: (title, options, delayMs, id) => scheduledNotificationManager.scheduleNotification(title, options, delayMs, id),
  getScheduledNotifications: () => scheduledNotificationManager.getScheduledNotifications(),
  clearAllScheduledNotifications: () => scheduledNotificationManager.clearAllScheduledNotifications(),
  removeScheduledNotification: (id) => scheduledNotificationManager.removeScheduledNotification(id)
};
