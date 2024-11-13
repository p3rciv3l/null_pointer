import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

console.log('Firebase config:', {
  apiKey: !!process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: !!process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: !!process.env.REACT_APP_FIREBASE_PROJECT_ID,
});

const auth = getAuth(initializeApp(firebaseConfig));

export default auth;
