// App/screens/HomeScreenDebug.js
// ==========================================================
// INSQUIZ - Pantalla Debug 2025
// Muestra TODO lo necesario para diagnosticar notificaciones,
// FCM, tokens, OTA, build type, permisos, etc.
// ==========================================================

import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, TouchableOpacity, Platform } from "react-native";
import * as Device from "expo-device";
import * as Application from "expo-application";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

export default function HomeScreenDebug() {
  const [expoToken, setExpoToken] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);
  const [perm, setPerm] = useState(null);
  const [channel, setChannel] = useState(null);
  const [errors, setErrors] = useState([]);

  // ==========================================================
  // Cargar datos iniciales
  // ==========================================================
  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      await getPermissions();
      await getExpoPushToken();
      await getFCMToken();
      if (Platform.OS === "android") {
        await getAndroidChannelInfo();
      }
    } catch (e) {
      setErrors(prev => [...prev, String(e)]);
    }
  }

  // ----------------------------------------------------------
  // PERMISOS
  // ----------------------------------------------------------
  async function getPermissions() {
    const p = await Notifications.getPermissionsAsync();
    setPerm(p);
  }

  // ----------------------------------------------------------
  // TOKEN EXPO
  // ----------------------------------------------------------
  async function getExpoPushToken() {
    try {
      const t = await Notifications.getExpoPushTokenAsync();
      setExpoToken(t?.data || null);
    } catch (err) {
      setExpoToken("❌ ERROR EXPO TOKEN");
      setErrors(prev => [...prev, "Expo token error: " + err.message]);
    }
  }

  // ----------------------------------------------------------
  // TOKEN NATIVO FCM
  // ----------------------------------------------------------
  async function getFCMToken() {
    try {
      const t = await Notifications.getDevicePushTokenAsync();
      setFcmToken(t?.data || null);
    } catch (err) {
      setFcmToken("❌ ERROR FCM TOKEN");
      setErrors(prev => [...prev, "FCM token error: " + err.message]);
    }
  }

  // ----------------------------------------------------------
  // CANAL ANDROID
  // ----------------------------------------------------------
  async function getAndroidChannelInfo() {
    try {
      const ch = await Notifications.getNotificationChannelAsync("default");
      setChannel(ch || null);
    } catch (err) {
      setChannel("❌ ERROR CHANNEL");
      setErrors(prev => [...prev, "Android channel error: " + err.message]);
    }
  }

  // ==========================================================
  // UI
  // ==========================================================
  return (
    <ScrollView style={{ padding: 20, backgroundColor: "#111", flex: 1 }}>
      <Text style={{ color: "#fff", fontSize: 26, fontWeight: "bold" }}>
        🐞 INSQUIZ DEBUG PANEL
      </Text>

      {/* BUILD INFO */}
      <Section title="🔧 BUILD INFO">
        <Info label="executionEnvironment" value={Constants.executionEnvironment} />
        <Info label="appOwnership" value={Constants.appOwnership} />
        <Info label="deviceName" value={Device.deviceName} />
        <Info label="deviceId (Installation ID)" value={Application.getAndroidId?.()} />
        <Info label="platform" value={Platform.OS} />
        <Info label="expo.runtimeVersion" value={Constants.expoConfig?.runtimeVersion} />
        <Info label="expo sdk" value={Constants.expoConfig?.sdkVersion} />
        <Info label="commit" value={Constants.expoConfig?.extra?.commit} />
      </Section>

      {/* PERMISOS */}
      <Section title="🔒 PERMISOS NOTIFICACIONES">
        <Info label="status" value={perm?.status} />
        <Info label="granted" value={String(perm?.granted)} />
        <Info label="canAskAgain" value={String(perm?.canAskAgain)} />
      </Section>

      {/* TOKENS */}
      <Section title="🔑 TOKENS">
        <Info label="EXPO TOKEN" value={expoToken} />
        <Info label="FCM TOKEN NATIVO" value={fcmToken} highlight />
      </Section>

      {/* CANALES */}
      {Platform.OS === "android" && (
        <Section title="📡 ANDROID CHANNEL">
          <Info label="id" value={channel?.id} />
          <Info label="name" value={channel?.name} />
          <Info label="importance" value={String(channel?.importance)} />
        </Section>
      )}

      {/* MANIFEST */}
      <Section title="🗂 MANIFEST INFO">
        <Info label="expo.extra.fcmServerKey" value={Constants.expoConfig?.extra?.fcmServerKey} />
        <Info label="android.googleServicesFile" value={Constants.expoConfig?.android?.googleServicesFile} />
      </Section>

      {/* ERRORES */}
      <Section title="❌ ERRORS">
        {errors.length === 0 && <Info label="No errors" value="✓ limpio" />}
        {errors.map((e, i) => (
          <Info key={i} label={`error #${i + 1}`} value={e} />
        ))}
      </Section>

      {/* BOTONES */}
      <TouchableOpacity
        onPress={loadAll}
        style={{
          marginTop: 30,
          backgroundColor: "#6a0dad",
          padding: 14,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>🔄 Recargar datos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ==========================================================
// SUBCOMPONENTES
// ==========================================================
function Section({ title, children }) {
  return (
    <View style={{ marginTop: 25, paddingBottom: 10, borderBottomColor: "#333", borderBottomWidth: 1 }}>
      <Text style={{ color: "#9b59b6", fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function Info({ label, value, highlight }) {
  return (
    <View style={{ marginBottom: 6 }}>
      <Text style={{ color: "#aaa", fontSize: 13 }}>{label}:</Text>
      <Text
        selectable
        style={{
          color: highlight ? "#00ff95" : "#fff",
          fontSize: highlight ? 17 : 15,
          fontWeight: highlight ? "bold" : "normal",
        }}
      >
        {String(value)}
      </Text>
    </View>
  );
}
