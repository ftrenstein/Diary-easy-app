// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

// Динамический импорт AsyncStorage только для native
let ReactNativeAsyncStorage = null;
if (Platform.OS !== 'web') {
  try {
    ReactNativeAsyncStorage =
      require('@react-native-async-storage/async-storage').default;
  } catch (e) {
    console.log('AsyncStorage not available, auth state will not persist');
  }
}

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

// Initialize Auth with persistence
let auth;
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  // Native: use AsyncStorage if available
  if (ReactNativeAsyncStorage) {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } else {
    auth = getAuth(app);
  }
}

export { auth };

// Initialize Firestore
export const db = getFirestore(app);
