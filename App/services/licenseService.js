// App/services/LicenseService.js
import { db } from "../firebase/firebaseConfig";
import { ref, get, update } from "firebase/database";
import { getDeviceId } from "./DeviceIdService";

export async function validateLicense(licenseKey) {
  console.log("🔍 VALIDANDO LICENCIA:", licenseKey);

  try {
    const deviceId = await getDeviceId();
    console.log("📱 DeviceID obtenido:", deviceId);

    const licenseRef = ref(db, `licenses/${licenseKey}`);
    const snap = await get(licenseRef);

    // 1) NO EXISTE
    if (!snap.exists()) {
      console.log("❌ LICENSE_NOT_FOUND");
      return { ok: false, reason: "LICENSE_NOT_FOUND" };
    }

    const lic = snap.val();
    console.log("📄 Licencia encontrada:", lic);

    // 2) INACTIVA
    if (lic.active !== true) {
      console.log("❌ LICENSE_INACTIVE");
      return { ok: false, reason: "LICENSE_INACTIVE" };
    }

    // 3) EXPIRADA
    if (
      lic.expiresAt !== "indefinida" &&
      typeof lic.expiresAt === "number" &&
      Date.now() > lic.expiresAt
    ) {
      console.log("❌ LICENSE_EXPIRED");
      return { ok: false, reason: "LICENSE_EXPIRED" };
    }

    // 4) OBTENER DEVICES
    const devices = lic.devices || {};
    const maxDevices = lic.maxDevices || 1;

    console.log("📦 Devices actuales:", devices);
    console.log("📦 maxDevices:", maxDevices);

    // ➤ Si YA EXISTE → OK
    if (devices[deviceId]) {
      console.log("✔ Dispositivo ya registrado");
      return { ok: true, reason: "OK_EXISTING_DEVICE" };
    }

    // ➤ Límite alcanzado
    const totalDevices = Object.keys(devices).length;

    console.log("📊 devicesCount:", totalDevices);

    if (totalDevices >= maxDevices) {
      console.log("❌ MAX_DEVICES_REACHED");
      return { ok: false, reason: "MAX_DEVICES_REACHED" };
    }

    // 5) REGISTRAR NUEVO DISPOSITIVO
    console.log("📝 Registrando nuevo dispositivo…");

    await update(licenseRef, {
      devices: {
        ...devices,
        [deviceId]: true,
      },
    });

    console.log("✔ Dispositivo registrado correctamente");

    return { ok: true, reason: "NEW_DEVICE_ADDED" };

  } catch (err) {
    console.log("❌ Error en validateLicense:", err);
    return { ok: false, reason: "ERROR" };
  }
}
