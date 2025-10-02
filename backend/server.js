const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from parent directory (the PWA files)
app.use(express.static(path.join(__dirname, '..')));

// Store tokens in memory and persist to file
let fcmTokens = new Set();

// Load tokens from file
const tokensFile = path.join(__dirname, 'fcm-tokens.json');
try {
  if (fs.existsSync(tokensFile)) {
    const data = fs.readFileSync(tokensFile, 'utf8');
    fcmTokens = new Set(JSON.parse(data));
  }
} catch (error) {
  console.error('Error loading tokens:', error);
}

// Save tokens to file
function saveTokens() {
  try {
    fs.writeFileSync(tokensFile, JSON.stringify([...fcmTokens]));
  } catch (error) {
    console.error('Error saving tokens:', error);
  }
}

// API Routes

// Subscribe endpoint - store FCM token
app.post('/api/subscribe', (req, res) => {
  const { token, userId } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  fcmTokens.add(token);
  saveTokens();

  console.log(`Token subscribed: ${userId || 'anonymous'}`);
  res.json({ success: true, message: 'Token subscribed successfully' });
});

// Send notification endpoint
app.post('/api/send-notification', async (req, res) => {
  const { title, body, icon, badge } = req.body;

  if (!title || !body) {
    return res.status(400).json({ error: 'Title and body are required' });
  }

  if (fcmTokens.size === 0) {
    return res.status(400).json({ error: 'No subscribed tokens' });
  }

  const FCM_SERVER_KEY = process.env.FCM_SERVER_KEY;
  if (!FCM_SERVER_KEY) {
    return res.status(500).json({ error: 'FCM server key not configured' });
  }

  const notification = {
    title: title,
    body: body,
    icon: icon || '/images/logo.png',
    badge: badge || '/images/favicon-32x32.png'
  };

  let successCount = 0;
  let failureCount = 0;

  // Send to all tokens
  const promises = [...fcmTokens].map(async (token) => {
    try {
      const response = await axios.post(
        'https://fcm.googleapis.com/fcm/send',
        {
          to: token,
          notification: notification
        },
        {
          headers: {
            'Authorization': `key=${FCM_SERVER_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success === 1) {
        successCount++;
      } else {
        failureCount++;
        // Remove invalid tokens
        fcmTokens.delete(token);
      }
    } catch (error) {
      failureCount++;
      console.error('Error sending to token:', error.response?.data || error.message);
      // Remove invalid tokens
      fcmTokens.delete(token);
    }
  });

  await Promise.all(promises);
  saveTokens();

  res.json({
    success: true,
    message: `Notification sent to ${successCount} devices, ${failureCount} failed`,
    sent: successCount,
    failed: failureCount
  });
});

// Get stats
app.get('/api/stats', (req, res) => {
  res.json({
    totalTokens: fcmTokens.size
  });
});

// Catch all handler: send back index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
