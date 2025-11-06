// App/screens/HomeScreen.js
// ==========================================================
// INSQUIZ - Home Principal
// ==========================================================
// Muestra logo, nombre de usuario (opcional), botón de práctica
// y botones adicionales para simulacro o logros.
// ==========================================================
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  return (
    <LinearGradient colors={["#4A148C", "#b40000"]} style={styles.container}>
      <View style={styles.header}>

        <Text style={styles.title}>InsQUIZ</Text>
        <Text style={styles.subtitle}>Prepárate para el ICFES de forma inteligente</Text>
        <Text style={styles.subtitle}>Mejora tu capacidad de compresion de textos</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => navigation.navigate("PracticeMenu")}
        >
          <LinearGradient
            colors={["#8e24aa", "#6a0dad"]}
            style={styles.gradientButton}
          >
            <MaterialCommunityIcons name="book-open-page-variant" size={28} color="#fff" />
            <Text style={styles.buttonText}>Modo práctica</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("RealSim")}
        >
          <MaterialCommunityIcons name="target" size={26} color="#fff" />
          <Text style={styles.secondaryText}>Simulacro real</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("Achievements")}
        >
          <MaterialCommunityIcons name="trophy" size={26} color="#fff" />
          <Text style={styles.secondaryText}>Mis logros</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>Versión 2.0 — Sin conexión, todo local ⚡</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 40 },
  logo: { width: 110, height: 110, marginBottom: 8 },
  title: { fontSize: 32, fontWeight: "bold", color: "#fff" },
  subtitle: { color: "#eee", fontSize: 16, textAlign: "center", width: "80%" },
  buttons: { alignItems: "center", width: "90%" },
  mainButton: { width: "90%", marginBottom: 20 },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingVertical: 18,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 22,
    width: "80%",
    justifyContent: "center",
    marginBottom: 14,
  },
  secondaryText: { color: "#fff", fontSize: 16, fontWeight: "500", marginLeft: 8 },
  footer: {
    position: "absolute",
    bottom: 25,
    color: "#ccc",
    fontSize: 13,
  },
});
