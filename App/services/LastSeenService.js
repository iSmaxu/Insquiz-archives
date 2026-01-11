// App/services/LastSeenService.js
// ==========================================================
// INSQUIZ — LastSeenService (throttled)
// ==========================================================

import { db } from "../firebase/firebaseConfig";
import { ref, update } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDeviceId } from "./DeviceIdService";

const LOCAL_KEY = "@lastSeen_local";
const MIN_INTERVAL = 5 * 60 * 1000; // ⏱️ 5 minutos

export async function updateLastSeenThrottled(licenseKey) {
  try {
    if (!licenseKey) return;

    const now = Date.now();
    const lastLocal = parseInt(
      (await AsyncStorage.getItem(LOCAL_KEY)) || "0",
      10
    );

    // ⛔ Aún no toca actualizar
    if (now - lastLocal < MIN_INTERVAL) {
      return;
    }

    const deviceId = await getDeviceId();

    const updates = {};
    updates[`licenses/${licenseKey}/lastSeen`] = now;
    updates[`licenses/${licenseKey}/devices/${deviceId}/lastSeen`] = now;

    await update(ref(db), updates);

    // 💾 Guardar último envío local
    await AsyncStorage.setItem(LOCAL_KEY, String(now));
  } catch (e) {
    console.log("❌ Error throttled lastSeen:", e);
  }
}
