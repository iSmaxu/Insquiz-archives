import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

export default function HomeScreenDebug() {
  const [pushToken, setPushToken] = useState("...");
  const [type, setType] = useState("...");
  const [log, setLog] = useState([]);

  function addLog(msg) {
    setLog((p) => [...p, msg]);
  }

  async function getToken() {
    addLog("🔍 Soliciting token...");
    const perm = await Notifications.requestPermissionsAsync();
    addLog("Permisos: " + JSON.stringify(perm));

    const token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });

    addLog("Token recibido: " + token.data);

    setPushToken(token.data);

    // Tipo detectado
    if (token.data.startsWith("ExponentPushToken")) {
      setType("Expo ❌");
    } else {
      setType("FCM token real ✔");
    }
  }

  useEffect(() => {
    getToken();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔧 Debug de Push</Text>

      <Text style={styles.label}>Tipo de Token:</Text>
      <Text style={styles.value}>{type}</Text>

      <Text style={styles.label}>Token:</Text>
      <Text style={styles.value}>{pushToken}</Text>


<View style={{ padding: 20, backgroundColor: "#111", borderRadius: 10 }}>
  <Text style={{ color: "white", fontSize: 12 }}>
    executionEnvironment: {String(Constants.executionEnvironment)}
  </Text>
  <Text style={{ color: "white", fontSize: 12 }}>
    appOwnership: {String(Constants.appOwnership)}
  </Text>
  <Text style={{ color: "white", fontSize: 12 }}>
    debugMode: {String(Constants.debugMode)}
  </Text>
  <Text style={{ color: "white", fontSize: 12 }}>
    releaseChannel: {String(Constants.releaseChannel)}
  </Text>
</View>

      <Text style={styles.label}>Logs:</Text>
      {log.map((l, i) => (
        <Text style={styles.log} key={i}>• {l}</Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 16, marginTop: 15, fontWeight: "bold" },
  value: { fontSize: 14, color: "#6a0dad" },
  log: { marginTop: 5, color: "#333" }
});
