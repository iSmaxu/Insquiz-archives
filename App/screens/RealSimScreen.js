// App/screens/RealSimScreen.js
// ===============================================
//   INSQUIZ — RealSim (Simulacro de 254 preguntas)
// ===============================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// IMPORTACIÓN CORRECTA DEL MOTOR REALSIM
import { generateRealSim } from "../services/quizService";

export default function RealSimScreen({ navigation }) {

  function startSimulacro() {
    const qs = generateRealSim(); // ✔ YA FUNCIONA

    if (!qs || qs.length === 0) {
      alert("No se pudieron generar preguntas del simulacro.");
      return;
    }

    navigation.navigate("QuizScreen", {
      questions: qs,
      subjectLabel: "Simulacro Tipo ICFES",
      mode: "realsim",
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simulacro RealTipo ICFES</Text>
      <Text style={styles.subtitle}>254 preguntas distribuidas por área</Text>

      <TouchableOpacity style={styles.startBtn} onPress={startSimulacro}>
        <MaterialCommunityIcons name="play" size={28} color="#fff" />
        <Text style={styles.startText}>Iniciar Simulacro</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fafafa",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#6a0dad",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: "#333",
    textAlign: "center",
    marginBottom: 26,
  },
  startBtn: {
    backgroundColor: "#6a0dad",
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  startText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  backBtn: {
    marginTop: 20,
    alignSelf: "center",
  },
  backText: {
    color: "#555",
    fontSize: 15,
  },
});
