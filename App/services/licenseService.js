import { db } from "../firebase/firebaseConfig";
import { ref, get, update } from "firebase/database";
import { getDeviceId } from "./DeviceIdService";
import { Platform } from "react-native";
import * as Device from "expo-device";

const THREE_HOURS = 3 * 60 * 60 * 1000;

// 🔐 IDENTIDAD DE LA APP
// Cambiar SOLO este valor en cada app
const APP_ID = "insquiz"; // o "didactiq"

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

    // 2️⃣ Validación por app (con soporte LEGACY)
    if (
      lic.app &&               // tiene app definida
      lic.app !== "legacy" &&  // no es universal
      lic.app !== APP_ID       // no corresponde a esta app
    ) {
      return { ok: false, reason: "LICENSE_APP_MISMATCH" };
    }

    // 3️⃣ Inactiva
    if (!lic.active) {
      return { ok: false, reason: "LICENSE_INACTIVE" };
    }

    // 4️⃣ Expirada
    if (
      lic.expiresAt !== "indefinida" &&
      typeof lic.expiresAt === "number" &&
      now > lic.expiresAt
    ) {
      return { ok: false, reason: "LICENSE_EXPIRED" };
    }

    const devices = lic.devices || {};
    const maxDevices = lic.maxDevices || 1;

    // 5️⃣ Dispositivo ya registrado
    if (devices[deviceId]) {
      const legacyDevice = devices[deviceId] === true;

      const previousLastSeen = legacyDevice
        ? 0
        : devices[deviceId].lastSeen || 0;

      const shouldUpdateLastSeen =
        now - previousLastSeen >= THREE_HOURS;

      const deviceData = legacyDevice
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

      if (legacyDevice || shouldUpdateLastSeen || fullName) {
        await update(
          ref(db, `licenses/${licenseKey}/devices/${deviceId}`),
          deviceData
        );
      }

      return { ok: true, reason: "OK_EXISTING_DEVICE" };
    }

    // 6️⃣ Límite de dispositivos alcanzado
    if (Object.keys(devices).length >= maxDevices) {
      return { ok: false, reason: "MAX_DEVICES_REACHED" };
    }

    // 7️⃣ Registrar nuevo dispositivo
    await update(licenseRef, {
      devices: {
        ...devices,
        [deviceId]: {
          fullName,
          firstSeen: now,
          lastSeen: now,
          platform: Platform.OS,
          model: Device.modelName || "unknown",
        },
      },
    });

    return { ok: true, reason: "NEW_DEVICE_ADDED" };

  } catch (err) {
    console.log("❌ validateLicense error:", err);
    return { ok: false, reason: "ERROR" };
  }
}
