// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: 'AIzaSyB5bIKiZ9_P3AxvuXG0Lq_KTSL2QTUZ6hs',
  authDomain: 'diary-easy-7d97a.firebaseapp.com',
  projectId: 'diary-easy-7d97a',
  storageBucket: 'diary-easy-7d97a.firebasestorage.app',
  messagingSenderId: '717169590664',
  appId: '1:717169590664:web:ad045abf460a1715c1ba3d',
  measurementId: 'G-3EKJ5J9VPV',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
