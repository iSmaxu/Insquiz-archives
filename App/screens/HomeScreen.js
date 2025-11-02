// App/screens/HomeScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>🎓 Bienvenido a InsQUIZ</Text>
      <Text style={styles.subtitle}>
        Entrena tus habilidades, mide tu progreso y alcanza tu máximo puntaje ICFES.
      </Text>

      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/906/906175.png",
        }}
        style={styles.banner}
      />

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Modos disponibles</Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#6a0dad" }]}
          onPress={() => navigation.navigate("Quiz")}
        >
          <Text style={styles.buttonText}>🧠 Modo Práctica</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#4caf50" }]}
          onPress={() => navigation.navigate("RealSim")}
        >
          <Text style={styles.buttonText}>🎯 Simulacro Real (400 preguntas)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#0288d1" }]}
          onPress={() => navigation.navigate("Achievements")}
        >
          <Text style={styles.buttonText}>🏅 Mis Logros y Estadísticas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#9c27b0" }]}
          onPress={() => navigation.navigate("RealSimReview")}
        >
          <Text style={styles.buttonText}>📘 Revisar Último Simulacro</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>Versión 3.0 — InsQUIZ Smart ICFES</Text>
        <Text style={styles.credit}>© 2025 iSmaxu — Todos los derechos reservados</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#6a0dad",
    textAlign: "center",
    marginTop: 10,
  },
  subtitle: {
    textAlign: "center",
    color: "#555",
    fontSize: 15,
    marginVertical: 8,
    paddingHorizontal: 10,
  },
  banner: {
    width: 200,
    height: 200,
    marginVertical: 20,
    resizeMode: "contain",
  },
  card: {
    backgroundColor: "#fafafa",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    marginVertical: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  footer: {
    marginTop: 25,
    alignItems: "center",
  },
  version: {
    color: "#777",
    fontSize: 13,
  },
  credit: {
    color: "#aaa",
    fontSize: 12,
    marginTop: 4,
  },
});
