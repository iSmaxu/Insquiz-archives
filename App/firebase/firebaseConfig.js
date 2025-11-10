// App/services/firebaseConfig.js
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
  apiKey: "AIzaSyCGFQPk4idrDgFpl1f0ixKF7D63vLYjZGA",
  authDomain: "insquiz-admin.firebaseapp.com",
  databaseURL: "https://insquiz-admin-default-rtdb.firebaseio.com",
  projectId: "insquiz-admin",
  storageBucket: "insquiz-admin.firebasestorage.app",
  messagingSenderId: "236979447253",
  appId: "1:236979447253:web:08c9075dbfa1183fa9095c",
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
