// App/services/DeviceIdService.js
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import * as Application from "expo-application";
import { randomUUID } from "expo-crypto";

const STORAGE_KEY = "INSQUIZ_DEVICE_ID";

/**
 * Devuelve un ID persistente por dispositivo.
 * - Se guarda en SecureStore
 * - No depende de IP
 * - Compatible con Android e iOS
 */
export async function getDeviceId() {
  try {
    const saved = await SecureStore.getItemAsync(STORAGE_KEY);
    if (saved) return saved;

    let systemId = null;

    if (Platform.OS === "android") {
      systemId = Application.androidId || null;
    } else if (Platform.OS === "ios") {
      try {
        systemId = await Application.getIosIdForVendorAsync();
      } catch {
        systemId = null;
      }
    }

    const finalId = systemId || `INSQUIZ-${randomUUID()}`;

    await SecureStore.setItemAsync(STORAGE_KEY, finalId);
    return finalId;

  } catch (err) {
    const fallback = `FALLBACK-${Date.now()}-${Math.random()}`;
    await SecureStore.setItemAsync(STORAGE_KEY, fallback);
    return fallback;
  }
}
