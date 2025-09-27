'use client';

import { useEffect } from 'react';

export default function PWAInstallPopup() {
  useEffect(() => {
    // PWA install logic
  }, []);

  return (
    <div id="pwa-install-popup" className="pwa-install-popup">
      <div className="pwa-popup-content">
        <div className="pwa-popup-icon">
          <img src="/images/logo.png" alt="Omega Jastip Logo" width="40" height="40" />
        </div>
        <div className="pwa-popup-text">
          <h4>Install Omega Jastip</h4>
          <p>Install aplikasi untuk akses lebih cepat dan offline</p>
        </div>
        <div className="pwa-popup-buttons">
          <button id="pwa-install-btn" className="pwa-btn-install">Install</button>
          <button id="pwa-close-btn" className="pwa-btn-close">Nanti</button>
        </div>
      </div>
    </div>
  );
}
