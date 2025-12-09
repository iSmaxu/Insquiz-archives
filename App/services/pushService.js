// App/services/pushService.js
// ==========================================================
// INSQUIZ - Push Service (sin Blaze, sin Functions)
// Registra el Expo Push Token en Realtime Database
// ==========================================================

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Alert, Platform } from "react-native";
import { db } from "../firebase/firebaseConfig";
import { ref, set } from "firebase/database";

export async function registerPushTokenInDB() {
  try {
    if (!Device.isDevice) {
      console.log("📵 Notificaciones solo en dispositivo físico.");
      return null;
    }

    const settings = await Notifications.getPermissionsAsync();
    let finalStatus = settings.status;

    if (finalStatus !== "granted") {
      const req = await Notifications.requestPermissionsAsync();
      finalStatus = req.status;
    }

    if (finalStatus !== "granted") {
      console.log("❌ Permiso de notificaciones denegado");
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const expoPushToken = tokenData.data;

    console.log("✅ Expo Push Token:", expoPushToken);

    // Guarda el token en una rama sencilla
    const tokenRef = ref(db, `pushTokens/${sanitizeToken(expoPushToken)}`);
    await set(tokenRef, {
      token: expoPushToken,
      createdAt: Date.now(),
      platform: Platform.OS,
    });

    return expoPushToken;
  } catch (err) {
    console.log("❌ Error registrando push token:", err);
    return null;
  }
}

// Para que sea key válida en RTDB
function sanitizeToken(token) {
  return token.replace(/[.#$/\[\]]/g, "_");
}
