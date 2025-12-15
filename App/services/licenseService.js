// App/services/LicenseService.js
import { db } from "../firebase/firebaseConfig";
import { ref, get, update } from "firebase/database";
import { getDeviceId } from "./DeviceIdService";

export async function validateLicense(licenseKey) {
  try {
    const deviceId = await getDeviceId();
    const licenseRef = ref(db, `licenses/${licenseKey}`);
    const snap = await get(licenseRef);

    // 1) NO EXISTE
    if (!snap.exists()) {
      return { ok: false, reason: "LICENSE_NOT_FOUND" };
    }

    const lic = snap.val();

    // 2) INACTIVA
    if (!lic.active) {
      return { ok: false, reason: "LICENSE_INACTIVE" };
    }

    // 3) EXPIRADA
    if (
      lic.expiresAt !== "indefinida" &&
      typeof lic.expiresAt === "number" &&
      Date.now() > lic.expiresAt
    ) {
      return { ok: false, reason: "LICENSE_EXPIRED" };
    }

    // 4) DISPOSITIVOS
    const devices = lic.devices || {};
    const maxDevices = lic.maxDevices || 1;

    // 4.1 Ya existe → OK
    if (devices[deviceId]) {
      return { ok: true, reason: "OK_EXISTING_DEVICE" };
    }

    // 4.2 Exceso de dispositivos
    if (Object.keys(devices).length >= maxDevices) {
      return { ok: false, reason: "MAX_DEVICES_REACHED" };
    }

    // 5) Registrar nuevo dispositivo
    await update(licenseRef, {
      devices: {
        ...devices,
        [deviceId]: true,
      },
    });

    return { ok: true, reason: "NEW_DEVICE_ADDED" };

  } catch (err) {
    console.log("❌ validateLicense error:", err);
    return { ok: false, reason: "ERROR" };
  }
}
