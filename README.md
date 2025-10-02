# Omega Jastip Lubuklinggau

Layanan jasa titip terpercaya di Lubuk Linggau untuk antar makanan, barang, penumpang, dan jasa belanja dengan cepat dan aman.

## 🚀 Fitur

- ✅ Progressive Web App (PWA) - Installable dan offline-ready
- 🔔 Push Notifications via Firebase Cloud Messaging (FCM)
- 📱 Responsive Design untuk desktop dan mobile
- 🗺️ Peta integrasi dengan Leaflet
- 💳 Kalkulator tarif jastip
- 📝 Blog dan informasi restoran
- 🔄 Service Worker untuk caching dan background sync

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **PWA**: Service Worker, Web App Manifest
- **Notifications**: Firebase Cloud Messaging
- **Backend**: Node.js, Express
- **Maps**: Leaflet.js
- **Deployment**: Railway (via GitHub Actions)

## 📦 Instalasi & Setup

### Prerequisites

- Node.js 16+
- Git
- Firebase Project (untuk FCM)
- Railway Account (untuk deployment)

### Setup Lokal

1. Clone repository:
```bash
git clone https://github.com/OmegaJastip/OmegaJastip.git
cd OmegaJastip
```

2. Install dependencies backend:
```bash
cd backend
npm install
```

3. Setup environment variables:
```bash
# Buat file .env di folder backend
FCM_SERVER_KEY=your_firebase_server_key_here
PORT=3000
```

4. Jalankan development server:
```bash
npm run dev
```

5. Buka browser ke `http://localhost:3000`

## 🚀 Deployment

### Otomatis via GitHub Actions

1. Fork repository ini
2. Buat project di [Railway](https://railway.app)
3. Connect GitHub repository ke Railway
4. Set environment variables di Railway:
   - `FCM_SERVER_KEY`: Server key dari Firebase Console > Project Settings > Cloud Messaging
   - `PORT`: 3000 (default)

### Manual Deployment

1. Push code ke GitHub
2. Railway akan otomatis deploy dari GitHub Actions

## 🔧 Konfigurasi Firebase

1. Buat project di [Firebase Console](https://console.firebase.google.com)
2. Enable Cloud Messaging
3. Copy konfigurasi ke `sw.js` dan `index.html`
4. Copy VAPID key ke `js/notifications.js`
5. Copy Server Key ke environment variable `FCM_SERVER_KEY`

## 📱 Admin Panel

Akses admin panel di `/pages/admin.html` untuk:
- Melihat jumlah subscriber notifikasi
- Mengirim broadcast notifikasi ke semua user

## 📊 Struktur Project

```
OmegaJastip/
├── backend/                 # Backend Node.js
│   ├── server.js           # Main server file
│   ├── package.json        # Dependencies
│   └── fcm-tokens.json     # Stored FCM tokens
├── css/                    # Stylesheets
├── js/                     # JavaScript files
├── images/                 # Images dan icons
├── pages/                  # Additional pages
├── data/                   # JSON data files
├── sw.js                   # Service Worker
├── manifest.json           # PWA Manifest
├── index.html              # Main page
└── README.md
```

## 🤝 Kontribusi

1. Fork repository
2. Buat branch fitur baru (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📞 Kontak

- WhatsApp: [+62 895 7003 41213](https://wa.me/62895700341213)
- Email: Jastipomega@gmail.com
- Instagram: [@omega_jastip_lubuklinggau](https://instagram.com/omega_jastip_lubuklinggau)

## 📄 Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

---

⭐ Jika repository ini bermanfaat, jangan lupa beri star!
