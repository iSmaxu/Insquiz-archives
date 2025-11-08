// App/screens/PracticeMenuScreen.js
// ==========================================================
// INSQUIZ - Menú de Práctica
// ==========================================================
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function PracticeMenuScreen({ navigation }) {
  const [showSubjects, setShowSubjects] = useState(false);

  const materias = [
    { key: "lectura", name: "Lectura crítica", icon: "book-open-page-variant" },
    { key: "matematicas", name: "Matemáticas", icon: "calculator" },
    { key: "ciencias_naturales", name: "Ciencias naturales", icon: "flask-outline" },
    { key: "ciencias_sociales", name: "Sociales y ciudadanas", icon: "earth" },
    { key: "ingles", name: "Inglés", icon: "translate" },
  ];

  return (
    <LinearGradient colors={["#4A148C", "#9b0000"]} style={styles.container}>
      <Text style={styles.title}>Modo práctica</Text>
      <Text style={styles.subtitle}>
        Elige cómo quieres practicar tus conocimientos
      </Text>

      <TouchableOpacity
        style={styles.optionCard}
        onPress={() => setShowSubjects(true)}
      >
        <MaterialCommunityIcons name="book-education" size={42} color="#fff" />
        <Text style={styles.optionTitle}>Practicar materia específica</Text>
        <Text style={styles.optionText}>10 preguntas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.optionCard, { backgroundColor: "#8e24aa" }]}
        onPress={() =>
          navigation.navigate("Quiz", {
            subject: "all",
            count: 50,
            subjectLabel: "Práctica completa",
          })
        }
      >
        <MaterialCommunityIcons name="layers-triple" size={42} color="#fff" />
        <Text style={styles.optionTitle}>Práctica completa</Text>
        <Text style={styles.optionText}>50 preguntas mezcladas</Text>
      </TouchableOpacity>

      {showSubjects && (
        <View style={styles.subjectList}>
          {materias.map((m, i) => (
            <TouchableOpacity
              key={i}
              style={styles.subjectCard}
              onPress={() =>
                navigation.navigate("Quiz", {
                  subject: m.key,
                  subjectLabel: m.name,
                  count: 10,
                })
              }
            >
              <MaterialCommunityIcons name={m.icon} size={24} color="#6a0dad" />
              <Text style={styles.subjectText}>{m.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: { fontSize: 28, color: "#fff", fontWeight: "bold", marginBottom: 6 },
  subtitle: {
    color: "#f0f0f0",
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
  },
  optionCard: {
    backgroundColor: "#6a0dad",
    width: "85%",
    paddingVertical: 20,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  optionTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    marginTop: 8,
  },
  optionText: {
    fontSize: 14,
    color: "#ddd",
    marginTop: 4,
  },
  subjectList: {
    width: "95%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginTop: 20,
  },
  subjectCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  subjectText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
  },
});
