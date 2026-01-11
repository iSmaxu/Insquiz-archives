// App/firebase/firebaseConfig.js
// ==========================================================
// INSQUIZ - Firebase Config (versión segura y persistente)
// ==========================================================
// Corrige:
//  - Error: Firebase: Error (auth/already-initialized)
//  - Warning: AsyncStorage persistence missing
// Mantiene compatibilidad con Realtime Database.
// ==========================================================

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";

// ==========================================================
// Configuración base (idéntica a tu versión anterior)
// ==========================================================
const firebaseConfig = {
  apiKey: "AIzaSyBfr6nIx2amaUgab0pBbm7Jw5Smklc8ACg",
  authDomain: "ivan-perezt.firebaseapp.com",
  databaseURL: "https://ivan-perezt-default-rtdb.firebaseio.com",
  projectId: "ivan-perezt",
  storageBucket: "ivan-perezt.firebasestorage.app",
  messagingSenderId: "322118361278",
  appId: "1:322118361278:web:31bc14c5196e28b30abeef",
  measurementId: "G-52PX20LC7X"
};

// ==========================================================
// Inicialización segura de la app
// ==========================================================
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ==========================================================
// Inicialización segura de Auth (con persistencia)
// ==========================================================
let auth;

try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (error) {
  // Si Auth ya fue inicializado, usa la instancia existente
  console.log("ℹ️ Firebase Auth ya inicializado, recuperando instancia.");
  auth = getAuth(app);
}

// ==========================================================
// Realtime Database
// ==========================================================
const db = getDatabase(app);

// ==========================================================
// Exportaciones limpias
// ==========================================================
export { app, auth, db };
export default app;
