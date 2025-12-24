import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  Platform,
} from "react-native";

import * as Application from "expo-application";
import * as Device from "expo-device";
import * as Updates from "expo-updates";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useLicense } from "../context/LicenseContext";
import { useOffline } from "../context/OfflineContext";
import { getDeviceId } from "../services/DeviceIdService";

export default function HomeDebug({ route, navigation }) {
  const { licenseKey, licenseStatus } = useLicense();
  const { isConnected, offlineLocked } = useOffline();

  const [deviceId, setDeviceId] = useState("...");
  const [storageDump, setStorageDump] = useState({});
  const [logs, setLogs] = useState([]);

  function log(msg) {
    const line = `[${new Date().toLocaleTimeString()}] ${msg}`;
    setLogs((prev) => [line, ...prev]);
    console.log(line);
  }

  useEffect(() => {
    (async () => {
      log("HomeDebug iniciado");

      const id = await getDeviceId();
      setDeviceId(id);
      log(`DeviceID: ${id}`);

      const keys = await AsyncStorage.getAllKeys();
      const values = await AsyncStorage.multiGet(keys);

      const dump = {};
      values.forEach(([k, v]) => (dump[k] = v));
      setStorageDump(dump);

      log("AsyncStorage cargado");
    })();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🧪 INSQUIZ · HOME DEBUG</Text>

      <Section title="📜 Licencia">
        <Item label="Status" value={licenseStatus} />
        <Item label="Key" value={licenseKey || "—"} />
        <Text style={styles.muted}>--Test--</Text>
      </Section>

      <Section title="🌐 Conectividad">
        <Item label="Conectado" value={String(isConnected)} />
        <Item label="Offline Locked" value={String(offlineLocked)} />
      </Section>

      <Section title="📱 Dispositivo">
        <Item label="Device ID" value={deviceId} />
        <Item label="Marca" value={Device.brand} />
        <Item label="Modelo" value={Device.modelName} />
        <Item label="OS" value={`${Platform.OS} ${Device.osVersion}`} />
      </Section>

      <Section title="📦 App">
        <Item label="App Name" value={Application.applicationName} />
        <Item label="Package" value={Application.applicationId} />
        <Item label="Versión" value={Application.nativeApplicationVersion} />
        <Item label="Build" value={Application.nativeBuildVersion} />
        <Item label="Runtime" value={Updates.runtimeVersion || "—"} />
      </Section>

      <Section title="🗂 AsyncStorage">
        {Object.keys(storageDump).length === 0 && (
          <Text style={styles.muted}>Vacío</Text>
        )}
        {Object.entries(storageDump).map(([k, v]) => (
          <Item key={k} label={k} value={v} />
        ))}
      </Section>

      <Section title="🧾 Logs">
        {logs.map((l, i) => (
          <Text key={i} style={styles.log}>
            {l}
          </Text>
        ))}
      </Section>

      <Button
        title="🧹 Limpiar logs"
        onPress={() => setLogs([])}
        color="#6a0dad"
      />
    </ScrollView>
  );
}

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Item({ label, value }) {
  return (
    <View style={styles.item}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{String(value)}</Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },
  section: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#c77dff",
    marginBottom: 8,
  },
  item: { marginBottom: 6 },
  label: { color: "#aaa", fontSize: 12 },
  value: { color: "#fff", fontSize: 14 },
  muted: { color: "#666" },
  log: {
    fontSize: 11,
    color: "#0f0",
    marginBottom: 4,
    fontFamily: Platform.OS === "android" ? "monospace" : undefined,
  },
});
