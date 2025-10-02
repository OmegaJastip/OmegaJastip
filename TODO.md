# TODO - Setup FCM Notifications & Deployment

## ✅ Completed
- [x] Add gcm_sender_id to manifest.json
- [x] Create backend/server.js with Express app
- [x] Create backend/package.json
- [x] Update js/notifications.js to call /api/subscribe
- [x] Create pages/admin.html for sending notifications
- [x] Create .github/workflows/deploy.yml for Railway deployment
- [x] Update README.md with setup and deployment instructions

## 🔄 Next Steps
- [ ] Get FCM Server Key from Firebase Console
- [ ] Set up Railway project and connect to GitHub
- [ ] Add RAILWAY_TOKEN secret to GitHub repository
- [ ] Set FCM_SERVER_KEY environment variable in Railway
- [ ] Test deployment
- [ ] Test notification sending from admin panel

## 📝 Notes
- FCM config already in sw.js and index.html
- VAPID key already in notifications.js
- Backend serves static files and handles FCM token storage/sending
- Admin panel at /pages/admin.html
- Deployment via GitHub Actions to Railway
