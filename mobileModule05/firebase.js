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
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
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
