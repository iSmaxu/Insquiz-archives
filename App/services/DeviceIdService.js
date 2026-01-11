// App/services/DeviceIdService.js

import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import * as Application from "expo-application";
import { randomUUID } from "expo-crypto";

const STORAGE_KEY = "INSQUIZ_DEVICE_ID";

export async function getDeviceId() {
  const saved = await SecureStore.getItemAsync(STORAGE_KEY);

  if (saved) {

    return saved;
  }

  let systemId = null;

  if (Platform.OS === "android") {
    systemId = Application.androidId || null;
  } else if (Platform.OS === "ios") {
    try {
      systemId = await Application.getIosIdForVendorAsync();
    } catch (e) {
      systemId = null;
    }
  }

  const finalId = systemId || `INSQUIZ-${randomUUID()}`;

  await SecureStore.setItemAsync(STORAGE_KEY, finalId);

  console.log(`🆔 [DeviceIdService] Me registré como (nuevo): ${finalId}`);

  return finalId;
}
