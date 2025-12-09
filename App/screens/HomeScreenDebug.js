// App/screens/HomeScreenDebug.js
// =====================================================
// INSQUIZ — HomeScreen Debug
// Verifica:
//  - FCM o Expo Token
//  - Registro en Firebase
//  - Estado de Worker Cloudflare
//  - Commit OTA
//  - XP Profile
// =====================================================

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../firebase/firebaseConfig";
import { ref, set } from "firebase/database";
import { XP_GetProfile } from "../engines/XP_Engine";
import { useLicense } from "../context/LicenseContext";

// =====================================================
// Registrar token en Firebase
// =====================================================
async function registerPushTokenInDB(token, platform) {
  try {
    const safe = token.replace(/[^a-zA-Z0-9]/g, "_");

    await set(ref(db, `pushTokens/${safe}`), {
      token,
      platform,
      createdAt: Date.now(),
    });

    return true;
  } catch (e) {
    console.log("❌ Error guardando token:", e);
    return false;
  }
}

// =====================================================
// Test Cloudflare Worker
// =====================================================
async function testWorker() {
  try {
    const res = await fetch(
      "https://insquiz-push-2025.ivanpereztech4.workers.dev"
    );
    return res.status === 200 ? "OK" : "ERROR";
  } catch {
    return "DOWN";
  }
}

export default function HomeScreenDebug() {
  const [token, setToken] = useState(null);
  const [tokenType, setTokenType] = useState("unknown");
  const [workerStatus, setWorkerStatus] = useState("...");
  const [commit, setCommit] = useState("...");
  const [xp, setXp] = useState(null);
  const { licenseKey } = useLicense();
  const [loading, setLoading] = useState(true);

  // =====================================================
  // 1) Obtener token push
  // =====================================================
  async function loadPushToken() {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") return;

      const pushToken = await Notifications.getExpoPushTokenAsync();

      const tokenStr = pushToken.data;
      setToken(tokenStr);

      // ¿Es FCM?
      if (tokenStr.startsWith("ExponentPushToken")) {
        setTokenType("Expo (NO SERVIRÁ EN BUILD)");
      } else {
        setTokenType("FCM (CORRECTO)");
      }

      // Guardar en DB
      await registerPushTokenInDB(tokenStr, "android");
    } catch (e) {
      console.log("❌ Error obteniendo token:", e);
    }
  }

  // =====================================================
  // 2) Cargar XP Profile y Commit OTA
  // =====================================================
  async function loadXP() {
    const p = await XP_GetProfile();
    setXp(p);
  }

  async function loadCommit() {
    const c = Constants.expoConfig?.extra?.commit ?? "unknown";
    setCommit(c);
  }

  // =====================================================
  // 3) Test Worker
  // =====================================================
  async function loadWorkerStatus() {
    const r = await testWorker();
    setWorkerStatus(r);
  }

  // =====================================================
  // Ejecutar todo
  // =====================================================
  useEffect(() => {
    async function run() {
      await loadPushToken();
      await loadXP();
      await loadCommit();
      await loadWorkerStatus();
      setLoading(false);
    }
    run();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6a0dad" />
        <Text style={{ marginTop: 10 }}>Cargando Debug…</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>INSQUIZ — DEBUG PANEL</Text>

      <DebugItem label="Licencia" value={licenseKey || "Ninguna"} />
      <DebugItem label="Push Token" value={token || "No generado"} />
      <DebugItem label="Token Type" value={tokenType} />
      <DebugItem label="Cloudflare Worker" value={workerStatus} />
      <DebugItem label="OTA Commit" value={commit} />

      <Text style={styles.subtitle}>XP Profile</Text>
      <DebugItem
        label="Level"
        value={xp?.level ?? "?"}
      />
      <DebugItem
        label="XP Actual"
        value={xp?.xp ?? "?"}
      />
      <DebugItem
        label="Total XP"
        value={xp?.totalXp ?? "?"}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => Notifications.scheduleNotificationAsync({
          content: { title: "Test Local", body: "Esto es una prueba local" },
          trigger: null
        })}
      >
        <Text style={styles.buttonText}>Probar Notificación Local</Text>
      </TouchableOpacity>

      <View style={{ height: 70 }} />
    </ScrollView>
  );
}

// =====================================================
// Componentes UI
// =====================================================
function DebugItem({ label, value }) {
  return (
    <View style={styles.item}>
      <Text style={styles.itemLabel}>{label}</Text>
      <Text style={styles.itemValue}>{value}</Text>
    </View>
  );
}

// =====================================================
// Estilos
// =====================================================
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#000" },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#6a0dad",
    marginBottom: 20,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: "800",
    color: "#fff",
  },

  item: {
    backgroundColor: "#111",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#333",
  },

  itemLabel: { color: "#888", fontSize: 14 },
  itemValue: { color: "#fff", fontSize: 16, marginTop: 4 },

  button: {
    backgroundColor: "#6a0dad",
    padding: 15,
    borderRadius: 12,
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    textAlign: "center",
    fontWeight: "700",
  },
});
