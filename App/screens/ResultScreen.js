// App/screens/ResultScreen.js
// ==========================================================
// INSQUIZ — RESULT SCREEN (2025)
// Evaluación estándar en escala de 500 puntos
// y acceso a la revisión de preguntas
// ==========================================================

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function ResultScreen({ route, navigation }) {
  const {
    score = 0,
    total = 1,
    area = "Resultado",
    mode = "classic",
    questions = [],
  } = route.params || {};

  // Porcentaje real
  const pct = ((score / total) * 100).toFixed(1);

  // Puntaje estandarizado sobre 500 (ICFES-like)
  const score500 = Math.round((score / total) * 500);

  function getMessage() {
    if (score500 >= 450) return "🔥 Rendimiento de nivel superior";
    if (score500 >= 400) return "🌟 Excelente desempeño";
    if (score500 >= 350) return "💪 Muy buen resultado";
    if (score500 >= 300) return "👍 Buen trabajo, sigue practicando";
    if (score500 >= 250) return "📘 Puedes mejorar, sigue intentándolo";
    return "🏁 No te rindas, cada intento suma";
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resultados</Text>

      <View style={styles.card}>
        <Text style={styles.area}>{area}</Text>

        {/* Puntaje oficial sobre 500 */}
        <Text style={styles.score500}>
          {score500}
          <Text style={styles.of500}> / 500</Text>
        </Text>

        <Text style={styles.message}>{getMessage()}</Text>

        {/* Puntaje real */}
        <Text style={styles.subScore}>
          Puntaje bruto: <Text style={styles.bold}>{score}/{total}</Text>
        </Text>

        <Text style={styles.subScore}>
          Porcentaje: <Text style={styles.bold}>{pct}%</Text>
        </Text>

        {/* Modo */}
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Modo:</Text>
          <Text style={styles.infoValue}>
            {mode === "realsim"
              ? "Simulacro Saber 11"
              : mode === "adaptive"
              ? "Práctica Adaptativa"
              : mode === "azar"
              ? "Selección Aleatoria"
              : mode === "full"
              ? "Mixto Completo"
              : "Práctica por materia"}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.replace("MainApp")}
      >
        <Text style={styles.btnText}>Volver al inicio</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.back}
        onPress={() =>
          navigation.navigate("ReviewScreen", { questions, area, mode })
        }
      >
        <Text style={styles.backText}>Revisar preguntas</Text>
      </TouchableOpacity>
    </View>
  );
}

// ==========================================================
// ESTILOS
// ==========================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050509",
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#f5f5ff",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#141320",
    width: "100%",
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: "#26263a",
    marginBottom: 28,
  },

  area: {
    fontSize: 16,
    color: "#a6a8c3",
    marginBottom: 6,
    textAlign: "center",
  },

  score500: {
    fontSize: 54,
    fontWeight: "900",
    color: "#ffcb3b",
    textAlign: "center",
    marginVertical: 6,
  },

  of500: {
    fontSize: 24,
    color: "#eaeaff",
    fontWeight: "600",
  },

  message: {
    textAlign: "center",
    color: "#d8d8ff",
    marginTop: 6,
    marginBottom: 16,
    fontSize: 15,
    fontWeight: "500",
  },

  subScore: {
    color: "#c9c9f3",
    textAlign: "center",
    marginBottom: 6,
    fontSize: 14,
  },

  bold: {
    fontWeight: "700",
    color: "#ffffff",
  },

  infoBox: {
    marginTop: 16,
    backgroundColor: "#1d1b28",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2b2a3d",
  },
  infoLabel: {
    color: "#a6a8c3",
    fontSize: 14,
  },
  infoValue: {
    color: "#f5f5ff",
    fontSize: 16,
    fontWeight: "600",
  },

  btn: {
    backgroundColor: "#6a0dad",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 999,
    marginBottom: 6,
  },

  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  back: { marginTop: 6 },
  backText: {
    color: "#bbb",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
