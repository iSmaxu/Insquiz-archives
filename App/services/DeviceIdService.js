import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import * as Application from "expo-application";
import { randomUUID } from "expo-crypto"; // UUID real y único

const STORAGE_KEY = "INSQUIZ_DEVICE_ID";

export async function getDeviceId() {
  try {
    // 1) Si ya existe un ID persistente → usarlo
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved) {
      return saved;
    }

    // 2) Intento de obtener ID real del sistema (solo si existe)
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

    // 3) Si no hay systemId o es null → generar uno perfecto con UUID
    const finalId = systemId || `INSQUIZ-${randomUUID()}`;

    // 4) Guardarlo para siempre en el dispositivo
    await AsyncStorage.setItem(STORAGE_KEY, finalId);

    return finalId;

  } catch (error) {
    console.log("❌ Error obteniendo deviceId:", error);

    // Última opción: generar un fallback único
    const generated = `FALLBACK-${Date.now()}-${Math.random()}`;
    await AsyncStorage.setItem(STORAGE_KEY, generated);
    return generated;
  }
}
