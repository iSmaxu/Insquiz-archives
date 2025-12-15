// App/services/RegisterUserService.js
// ==========================================================
// INSQUIZ - Register User Service (NEUTRALIZADO)
// ----------------------------------------------------------
// 🔕 Sin OneSignal
// 🔕 Sin notificaciones
// ✅ Mantiene registro de usuario/licencia
// ==========================================================

import * as Device from "expo-device";
import * as Application from "expo-application";
import { db } from "../firebase/firebaseConfig";
import { ref, update, get } from "firebase/database";

export async function registerUserForNotifications(licenseKey, nickname) {
  try {
    // Device ID (solo identificación local)
    let deviceId = await Application.getAndroidId();
    if (!deviceId) {
      deviceId =
        Device.osInternalBuildId || "unknown-" + Math.random().toString(36);
    }

    const userId = `${licenseKey}__${deviceId}`;

    // Obtener datos de licencia
    const licSnap = await get(ref(db, `licenses/${licenseKey}`));
    const lic = licSnap.exists() ? licSnap.val() : {};

    const now = new Date().toISOString();

    const userData = {
      nickname,
      licenseKey,
      clientName: lic.clientName || "Sin nombre",
      expiresAt: lic.expiresAt || "indefinida",
      active: lic.active ?? true,

      // 🔕 Push deshabilitado
      playerId: null,

      deviceId,
      deviceModel: Device.modelName || "Dispositivo",
      createdAt: now,
      lastActive: now,
      updatedAt: now,
    };

    await update(ref(db, `users/${userId}`), userData);

    console.log("✔ Usuario registrado (sin notificaciones)");
  } catch (err) {
    console.log("❌ Error registrando usuario:", err);
  }
}
