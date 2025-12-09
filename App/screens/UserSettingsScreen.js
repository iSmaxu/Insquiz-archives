// App/screens/UserSettingsScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Updates from "expo-updates";
import { useLicense } from "../context/LicenseContext";

export default function UserSettingsScreen({ navigation }) {
  const { licenseKey, logout } = useLicense();
  const [maskedKey, setMaskedKey] = useState("");

  useEffect(() => {
    if (licenseKey) {
      setMaskedKey(licenseKey.slice(0, 3) + "*".repeat(licenseKey.length - 3));
    }
  }, [licenseKey]);

  async function handleCheckUpdates() {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync(); // reinicio silencioso
      } else {
        Alert.alert("Sin actualizaciones", "Ya estás en la última versión.");
      }
    } catch (e) {
      Alert.alert("Error", "No se pudo buscar actualizaciones.");
    }
  }

  async function handleLogout() {
    Alert.alert(
      "Cerrar sesión",
      "¿Deseas eliminar la licencia y salir?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            await logout();
            navigation.reset({
              index: 0,
              routes: [{ name: "LicenseScreen" }],
            });
          },
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Configuración</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Licencia activa</Text>

        <View style={styles.row}>
          <Ionicons name="key-outline" size={22} color="#6a0dad" />
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.value}>Licencia InsQUIZ</Text>
        </View>

        <View style={styles.row}>
          <Ionicons name="lock-closed-outline" size={22} color="#6a0dad" />
          <Text style={styles.label}>Licencia:</Text>
          <Text style={styles.value}>{maskedKey || "Ninguna"}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleCheckUpdates}>
        <Ionicons name="cloud-download-outline" size={22} color="#fff" />
        <Text style={styles.buttonText}>Buscar actualizaciones</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#fff" />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f2ff", padding: 20 },
  title: {
    fontSize: 26,
    color: "#6a0dad",
    fontWeight: "900",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    elevation: 3,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    color: "#6a0dad",
    fontWeight: "800",
    marginBottom: 10,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  label: {
    marginLeft: 8,
    fontSize: 15,
    color: "#444",
    fontWeight: "600",
  },
  value: {
    marginLeft: 6,
    fontSize: 15,
    color: "#6a0dad",
    fontWeight: "700",
  },
  button: {
    backgroundColor: "#6a0dad",
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: "#d62828",
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    marginLeft: 10,
  },
});
