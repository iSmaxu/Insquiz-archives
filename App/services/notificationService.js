// App/services/notificationService.js
// ==========================================================
// INSQUIZ - Notificaciones Push (Expo + Firebase, simple)
// - Pide permisos automáticamente si no los tiene
// - Si ya tiene permisos, solo saca el token
// - Guarda el token en Realtime DB: /pushTokens/{deviceId}
// ==========================================================

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform, Linking, Alert } from "react-native";
import { ref, set, update, get } from "firebase/database";
import { db } from "../firebase/firebaseConfig";

// 🔔 Handler global: cómo se muestran las notificaciones cuando llegan
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ----------------------------------------------------------
// 1) Pedir permisos automáticamente
// ----------------------------------------------------------
async function ensureNotificationPermission() {
  try {
    const current = await Notifications.getPermissionsAsync();
    console.log("📌 Estado permisos inicial:", current);

    // Ya concedido
    if (current.status === "granted") {
      return { granted: true };
    }

    // iOS: si está denegado definitivamente, solo se puede ir a ajustes
    if (current.status === "denied" && Platform.OS === "ios") {
      Alert.alert(
        "Notificaciones bloqueadas",
        "Para activar las notificaciones, entra a Ajustes → Notificaciones → InsQUIZ y actívalas.",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Abrir ajustes", onPress: () => Linking.openSettings() },
        ]
      );
      return { granted: false };
    }

    // Android o iOS que aún no había preguntado o puede preguntar de nuevo
    const requested = await Notifications.requestPermissionsAsync();
    console.log("📌 Resultado solicitud permisos:", requested);

    if (requested.status === "granted") {
      return { granted: true };
    }

    // Si después de pedir sigue sin permisos:
    Alert.alert(
      "Permiso necesario",
      "No se pudieron activar las notificaciones. Puedes habilitarlas desde los ajustes del sistema.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Abrir ajustes", onPress: () => Linking.openSettings() },
      ]
    );

    return { granted: false };
  } catch (err) {
    console.log("❌ Error comprobando/solicitando permisos:", err);
    return { granted: false };
  }
}

// ----------------------------------------------------------
// 2) Obtener token Expo (ya con permisos)
// ----------------------------------------------------------
async function getExpoPushTokenAuto() {
  if (!Device.isDevice) {
    console.log("⚠️ Notificaciones solo disponibles en dispositivo físico");
    return null;
  }

  // Asegurar permisos
  const perm = await ensureNotificationPermission();
  if (!perm.granted) {
    console.log("⚠️ No se obtuvo permiso de notificaciones");
    return null;
  }

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData?.data;
    console.log("🔑 EXPO PUSH TOKEN:", token);

    if (!token) {
      console.log("⚠️ getExpoPushTokenAsync devolvió token vacío o null");
      return null;
    }

    // Canal Android
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    return token;
  } catch (err) {
    console.log("❌ Error obteniendo token Expo:", err);
    return null;
  }
}

// ----------------------------------------------------------
// 3) Registrar token y guardarlo en Firebase
// ----------------------------------------------------------
export async function registerAndSavePushToken(deviceId, licenseKey) {
  try {
    if (!deviceId) {
      console.log("⚠️ No hay deviceId, no se puede registrar pushToken.");
      return { ok: false, reason: "NO_DEVICE_ID" };
    }

    const token = await getExpoPushTokenAuto();
    if (!token) {
      console.log("⚠️ No se pudo obtener token Expo.");
      return { ok: false, reason: "NO_TOKEN" };
    }

    const nodeRef = ref(db, `pushTokens/${deviceId}`);

    const payload = {
      token,
      licenseKey: licenseKey || null,
      platform: Platform.OS,
      updatedAt: Date.now(),
    };

    const snap = await get(nodeRef);
    if (snap.exists()) {
      await update(nodeRef, payload);
      console.log("✅ Push token ACTUALIZADO en Firebase para", deviceId);
    } else {
      await set(nodeRef, payload);
      console.log("✅ Push token CREADO en Firebase para", deviceId);
    }

    return { ok: true, token };
  } catch (err) {
    console.log("❌ Error guardando push token:", err);
    return { ok: false, reason: "SAVE_ERROR" };
  }
}
