// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getMessaging } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-messaging.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";

// Your web app's Firebase configuration
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firebaseMessaging = getMessaging(app);

export { firebaseMessaging };
