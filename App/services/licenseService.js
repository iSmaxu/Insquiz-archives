// App/services/LicenseService.js
import { db } from "../firebase/firebaseConfig";
import { ref, get, update } from "firebase/database";
import { getDeviceId } from "./DeviceIdService";
import { Platform } from "react-native";
import * as Device from "expo-device";

const THREE_HOURS = 3 * 60 * 60 * 1000;

/**
 * Valida licencia y registra/migra el dispositivo.
 * Compatible con datos legacy (devices: true).
 */
export async function validateLicense(licenseKey, fullName = null) {
  try {
    const deviceId = await getDeviceId();
    const now = Date.now();

    const licenseRef = ref(db, `licenses/${licenseKey}`);
    const snap = await get(licenseRef);

    // 1️⃣ No existe
    if (!snap.exists()) {
      return { ok: false, reason: "LICENSE_NOT_FOUND" };
    }

    const lic = snap.val();

    // 2️⃣ Inactiva
    if (!lic.active) {
      return { ok: false, reason: "LICENSE_INACTIVE" };
    }

    // 3️⃣ Expirada
    if (
      lic.expiresAt !== "indefinida" &&
      typeof lic.expiresAt === "number" &&
      now > lic.expiresAt
    ) {
      return { ok: false, reason: "LICENSE_EXPIRED" };
    }

    // 4️⃣ Dispositivos
    const devices = lic.devices || {};
    const maxDevices = lic.maxDevices || 1;

    // 4.1️⃣ Ya existe (legacy o nuevo)
    if (devices[deviceId]) {
      const legacy = devices[deviceId] === true;

      const previousLastSeen = legacy ? 0 : devices[deviceId].lastSeen || 0;
      const shouldUpdateLastSeen = now - previousLastSeen >= THREE_HOURS;

      const deviceData = legacy
        ? {
            fullName,
            firstSeen: now,
            lastSeen: now,
            platform: Platform.OS,
            model: Device.modelName || "unknown",
          }
        : {
            ...devices[deviceId],
            ...(shouldUpdateLastSeen && { lastSeen: now }),
            fullName: fullName || devices[deviceId].fullName || null,
          };

      if (legacy || shouldUpdateLastSeen || fullName) {
        await update(
          ref(db, `licenses/${licenseKey}/devices/${deviceId}`),
          deviceData
        );
      }

      return { ok: true, reason: "OK_EXISTING_DEVICE" };
    }

    // 4.2️⃣ Exceso de dispositivos
    if (Object.keys(devices).length >= maxDevices) {
      return { ok: false, reason: "MAX_DEVICES_REACHED" };
    }

    // 5️⃣ Registrar nuevo dispositivo
    const deviceData = {
      fullName,
      firstSeen: now,
      lastSeen: now,
      platform: Platform.OS,
      model: Device.modelName || "unknown",
    };

    await update(licenseRef, {
      devices: {
        ...devices,
        [deviceId]: deviceData,
      },
    });

    return { ok: true, reason: "NEW_DEVICE_ADDED" };

  } catch (err) {
    console.log("❌ validateLicense error:", err);
    return { ok: false, reason: "ERROR" };
  }
}
