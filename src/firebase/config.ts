import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBGdaM0R8wx7picy9d2D2mgx7T4Mxjl1so",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "notice-board-ec16c.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "notice-board-ec16c",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "notice-board-ec16c.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "998887742705",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:998887742705:web:68fabdc3820c13ba4d5d50",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-9031XXY38W",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
