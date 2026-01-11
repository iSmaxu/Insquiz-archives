// App/screens/UserSettingsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Updates from "expo-updates";
import { useLicense } from "../context/LicenseContext";

export default function UserSettingsScreen({ navigation }) {
  const { licenseKey, fullName, logout } = useLicense();
  const [maskedKey, setMaskedKey] = useState("");

  useEffect(() => {
    if (licenseKey) {
      setMaskedKey(
        licenseKey.slice(0, 3) +
          "*".repeat(Math.max(licenseKey.length - 3, 0))
      );
    }
  }, [licenseKey]);

  async function handleCheckUpdates() {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      } else {
        Alert.alert(
          "Sin actualizaciones",
          "Ya estás usando la versión más reciente."
        );
      }
    } catch {
      Alert.alert(
        "Error",
        "No se pudo verificar si hay actualizaciones disponibles."
      );
    }
  }

  function handleOpenDebug() {
    Alert.alert(
      "Modo diagnóstico",
      "Esta sección muestra información técnica interna de la aplicación.\n\n" +
        "Está pensada para pruebas, soporte y diagnóstico de errores.\n\n" +
        "No es necesaria para el uso normal y puede mostrar mensajes que no son relevantes para la mayoría de los usuarios.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Entiendo, continuar",
          style: "default",
          onPress: () => navigation.navigate("Settings", {
  screen: "Debug",
}),
        },
      ]
    );
  }

  async function handleLogout() {
    Alert.alert(
      "Cerrar sesión",
      "Esto eliminará la licencia almacenada en este dispositivo y volverás a la pantalla de activación.",
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <Text style={styles.title}>Configuración</Text>

      {/* LICENCIA */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Licencia activa</Text>

        <View style={styles.row}>
          <Ionicons
            name="person-outline"
            size={22}
            color="#6a0dad"
          />
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.value}>
            {fullName || "No definido"}
          </Text>
        </View>

        <View style={styles.row}>
          <Ionicons
            name="lock-closed-outline"
            size={22}
            color="#6a0dad"
          />
          <Text style={styles.label}>Licencia:</Text>
          <Text style={styles.value}>
            {maskedKey || "Ninguna"}
          </Text>
        </View>
      </View>

      {/* ACTUALIZACIONES */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleCheckUpdates}
      >
        <Ionicons
          name="cloud-download-outline"
          size={22}
          color="#fff"
        />
        <Text style={styles.buttonText}>
          Buscar actualizaciones
        </Text>
      </TouchableOpacity>

      {/* DIAGNÓSTICO */}
      <View style={styles.cardSoft}>
        <Text style={styles.cardTitleSoft}>
          Diagnóstico y soporte
        </Text>

        <Text style={styles.helperText}>
          Esta sección permite ver mensajes internos del sistema
          que pueden ser útiles para identificar errores,
          problemas de conexión o fallos durante el uso.
        </Text>

        <Text style={styles.helperText}>
          No es necesaria para el uso normal de la aplicación.
        </Text>

        <TouchableOpacity
          style={styles.debugButton}
          onPress={handleOpenDebug}
        >
          <Ionicons
            name="terminal-outline"
            size={22}
            color="#fff"
          />
          <Text style={styles.debugText}>
            Abrir modo diagnóstico
          </Text>
        </TouchableOpacity>
      </View>

      {/* LOGOUT */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons
          name="log-out-outline"
          size={22}
          color="#fff"
        />
        <Text style={styles.logoutText}>
          Cerrar sesión
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f2ff",
    padding: 20,
  },
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

  cardSoft: {
    backgroundColor: "#fdfcff",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e3d9ff",
    marginBottom: 20,
  },
  cardTitleSoft: {
    fontSize: 17,
    color: "#6a0dad",
    fontWeight: "800",
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
    lineHeight: 18,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
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
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    marginLeft: 10,
  },

  debugButton: {
    marginTop: 10,
    backgroundColor: "#4b2ca3",
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  debugText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
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
