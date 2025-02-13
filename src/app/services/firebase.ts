import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// You can import more services, e.g. getFirestore, getAnalytics, etc.

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
  
// Initialize Firebase only once
const app = initializeApp(firebaseConfig);

// Export whatever you need (Auth, Firestore, etc.)
export const auth = getAuth(app);
// Example: export const db = getFirestore(app);
// Example: export const analytics = getAnalytics(app);
