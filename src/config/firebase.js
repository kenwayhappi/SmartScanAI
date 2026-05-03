import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration Firebase du projet Smart Scan AI
const firebaseConfig = {
  apiKey: "AIzaSyAIWKAcJPveYVwgN_uQi9Fo2CrpH121CPg",
  authDomain: "smartscanai-1aa28.firebaseapp.com",
  projectId: "smartscanai-1aa28",
  storageBucket: "smartscanai-1aa28.firebasestorage.app",
  messagingSenderId: "596470449200",
  appId: "1:596470449200:web:62c6c193fca2661ceb59f5"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(app);
