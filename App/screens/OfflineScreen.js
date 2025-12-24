// App/screens/OfflineScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useOffline } from "../context/OfflineContext";

export default function OfflineScreen({ navigation }) {
  const { isConnected, checking } = useOffline();

  function tryReconnect() {
    if (isConnected) {
      navigation.reset({
        index: 0,
        routes: [{ name: "BootScreen" }],
      });
    }
  }

  return (
    <View style={styles.container}>
      <Ionicons name="wifi-off" size={80} color="#fff" />

      <Text style={styles.title}>Sin conexión a Internet</Text>

      <Text style={styles.text}>
        Insquiz necesita conexión a internet para poder asegurar la seguridad.
        Si crees que esto es un error, contacta con soporte.
      </Text>

      <Text style={styles.subtext}>
        Apenas vuelva la conexión podrás continuar.
      </Text>

      <TouchableOpacity
        style={[
          styles.button,
          !isConnected && { opacity: 0.5 },
        ]}
        disabled={!isConnected || checking}
        onPress={tryReconnect}
      >
        <Text style={styles.buttonText}>
          {checking ? "Comprobando..." : "Reintentar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6a0dad",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    textAlign: "center",
    marginTop: 16,
  },
  text: {
    marginTop: 14,
    color: "#f5e6ff",
    fontSize: 16,
    textAlign: "center",
  },
  subtext: {
    marginTop: 6,
    color: "#e8d9ff",
    fontSize: 14,
    textAlign: "center",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#fff",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: "#6a0dad",
    fontWeight: "800",
    fontSize: 16,
  },
});
