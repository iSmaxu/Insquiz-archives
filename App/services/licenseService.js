// App/services/licenseService.js
// ==========================================================
// INSQUIZ - License Service (versión final estable)
// ==========================================================
// ✅ Solo lectura y registro de dispositivo
// ✅ Soporte para licencias indefinidas
// ✅ Control de múltiples dispositivos
// ✅ 100% compatible con LicenseGate y LicenseScreen
// ==========================================================

import { db } from "../firebase/firebaseConfig";
import { ref, get, update } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";

// ==========================================================
// 🔹 Utilidades internas
// ==========================================================

async function getDeviceId() {
  try {
    return (
      Device.osBuildId ||
      Device.modelId ||
      `${Device.manufacturer || "Unknown"}-${Device.modelName || "Device"}`
    );
  } catch {
    return "unknown-device";
  }
}

// ==========================================================
// 🔹 Obtener licencia local (para LicenseGate)
// ==========================================================
export async function getLicenseToken() {
  try {
    const key = await AsyncStorage.getItem("license_key");
    return key || null;
  } catch (e) {
    console.warn("Error leyendo license_key local:", e);
    return null;
  }
}

// ==========================================================
// 🔹 Validar licencia en Firebase (solo lectura + registro de dispositivo)
// ==========================================================
export async function validateLicenseOnlineDetailed(key) {
  try {
    if (!key) return { valid: false, reason: "Sin licencia local" };

    const licenseRef = ref(db, `licenses/${key}`);
    const snapshot = await get(licenseRef);

    if (!snapshot.exists()) {
      return { valid: false, reason: "Licencia no encontrada" };
    }

    const data = snapshot.val();
    const now = Date.now();

    // ==========================================================
    // 🧠 Evaluar vigencia
    // ==========================================================
    const expiresRaw = data.expiresAt || null;
    const active = data.active || false;

    const indefinite =
      data.indefinite === true ||
      (typeof expiresRaw === "string" &&
        ["indefinida", "indefinite"].includes(expiresRaw.toLowerCase()));

    let expiresAt = null;
    if (!indefinite && expiresRaw) {
      const parsed = new Date(expiresRaw);
      expiresAt = isNaN(parsed.getTime()) ? null : parsed.getTime();
    }

    const valid = active && (indefinite || (expiresAt && expiresAt > now));
    if (!valid) {
      return { valid: false, reason: "Licencia expirada o inactiva" };
    }

    // ==========================================================
    // 🔢 Control de dispositivos múltiples
    // ==========================================================
    const maxDevices = data.maxDevices || 1;
    const deviceList = Array.isArray(data.deviceList) ? data.deviceList : [];
    const currentDevice = await getDeviceId();

    const alreadyRegistered = deviceList.includes(currentDevice);

    // Si no está registrado y hay cupo, añadirlo
    if (!alreadyRegistered && deviceList.length < maxDevices) {
      try {
        const newList = [...deviceList, currentDevice];
        await update(licenseRef, { deviceList: newList });
        console.log("📱 Dispositivo vinculado a la licencia");
      } catch (err) {
        console.warn("Error registrando dispositivo:", err);
      }
    }

    // Si excede el límite → no válida
    if (!alreadyRegistered && deviceList.length >= maxDevices) {
      return {
        valid: false,
        reason: `Límite de dispositivos alcanzado (${maxDevices})`,
      };
    }

    // ==========================================================
    // ✅ Licencia válida
    // ==========================================================
    return {
      valid: true,
      device: currentDevice,
      indefinite,
      maxDevices,
      clientName: data.clientName || "Desconocido",
    };
  } catch (error) {
    console.error("Error validando licencia:", error);
    return { valid: false, reason: "Error de conexión o Firebase" };
  }
}

// ==========================================================
// 🔹 Activar licencia localmente (solo guarda y registra dispositivo)
// ==========================================================
export async function activateLicenseLocal(licenseKey) {
  try {
    if (!licenseKey) return { ok: false, error: "Código vacío" };

    const licenseRef = ref(db, `licenses/${licenseKey}`);
    const snapshot = await get(licenseRef);

    if (!snapshot.exists()) {
      return { ok: false, error: "Licencia no encontrada" };
    }

    const data = snapshot.val();
    if (!data.active) {
      return { ok: false, error: "Licencia inactiva o no aprobada" };
    }

    // Guardar localmente
    await AsyncStorage.setItem("license_key", licenseKey);
    console.log("💾 Licencia guardada localmente:", licenseKey);

    // Registrar el dispositivo si no existe
    const currentDevice = await getDeviceId();
    const deviceList = Array.isArray(data.deviceList) ? data.deviceList : [];

    if (!deviceList.includes(currentDevice)) {
      if (deviceList.length >= (data.maxDevices || 1)) {
        return {
          ok: false,
          error: `Límite de dispositivos alcanzado (${data.maxDevices || 1})`,
        };
      }

      try {
        const newList = [...deviceList, currentDevice];
        await update(licenseRef, { deviceList: newList });
        console.log("📱 Dispositivo registrado");
      } catch (err) {
        console.warn("Error registrando dispositivo:", err);
      }
    }

    return { ok: true };
  } catch (e) {
    console.error("Error activando licencia local:", e);
    return { ok: false, error: e.message };
  }
}
