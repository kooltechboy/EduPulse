
import { initializeApp } from 'https://esm.sh/firebase@10/app';
import { getFirestore } from 'https://esm.sh/firebase@10/firestore';
import { getAnalytics } from 'https://esm.sh/firebase@10/analytics';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "edupulse-2026.firebaseapp.com",
  projectId: "edupulse-2026",
  storageBucket: "edupulse-2026.appspot.com",
  messagingSenderId: "institutional-node",
  appId: "1:2026:web:edupulse",
  measurementId: "G-PULSE"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
