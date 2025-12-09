// App/screens/PracticeMenuScreen.js
// ==========================================================
// INSQUIZ - Menú de Práctica (corregido con scroll completo)
// ==========================================================

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ScrollWrapper from "../components/ScrollWrapper";

import CustomPracticeModal from "../components/CustomPracticeModal";

export default function PracticeMenuScreen({ navigation }) {
  const [showSubjects, setShowSubjects] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);

  const materias = [
    { key: "lectura_critica", name: "Lectura crítica", icon: "book-open-page-variant" },
    { key: "matematicas", name: "Matemáticas", icon: "calculator" },
    { key: "ciencias_naturales", name: "Ciencias naturales", icon: "flask-outline" },
    { key: "ciencias_sociales", name: "Sociales y ciudadanas", icon: "earth" },
    { key: "ingles", name: "Inglés", icon: "translate" },
  ];

  return (
    <LinearGradient colors={["#4A148C", "#9b0000"]} style={styles.container}>

      {/* 🔙 VOLVER */}
      <TouchableOpacity
        style={styles.homeBtn}
        onPress={() => navigation.navigate("HomeScreen")}
      >
        <MaterialCommunityIcons name="arrow-left" size={26} color="#fff" />
      </TouchableOpacity>

      {/* 🟣 SCROLL COMPLETO */}
      <ScrollWrapper style={{ paddingTop: 60, paddingHorizontal: 20 }}>

        <Text style={styles.title}>Modo práctica</Text>
        <Text style={styles.subtitle}>Elige cómo quieres practicar tus conocimientos</Text>

        {/* MODO PERSONALIZADO */}
        <TouchableOpacity
          style={styles.customCard}
          onPress={() => setShowCustomModal(true)}
        >
          <View style={styles.customIconBox}>
            <Text style={styles.customIcon}>⚙</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.customTitle}>Modo Personalizado</Text>
            <Text style={styles.customSubtitle}>Elige cuántas preguntas quieres y de qué materia</Text>
          </View>
        </TouchableOpacity>

        {/* PRACTICAR MATERIA */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => setShowSubjects(!showSubjects)}
        >
          <MaterialCommunityIcons name="book-education" size={42} color="#fff" />
          <Text style={styles.optionTitle}>Practicar materia específica</Text>
          <Text style={styles.optionText}>10 preguntas</Text>
        </TouchableOpacity>

        {/* PRACTICA COMPLETA */}
        <TouchableOpacity
          style={[styles.optionCard, { backgroundColor: "#8e24aa" }]}
          onPress={() =>
            navigation.navigate("QuizScreen", {
              subject: "all",
              subjectLabel: "Práctica completa",
              count: 50,
              mode: "practice",
            })
          }
        >
          <MaterialCommunityIcons name="layers-triple" size={42} color="#fff" />
          <Text style={styles.optionTitle}>Práctica completa</Text>
          <Text style={styles.optionText}>50 preguntas mezcladas</Text>
        </TouchableOpacity>

        {/* LISTA DE MATERIAS */}
        {showSubjects && (
          <View style={styles.subjectList}>
            {materias.map((m) => (
              <TouchableOpacity
                key={m.key}
                style={styles.subjectCard}
                onPress={() =>
                  navigation.navigate("QuizScreen", {
                    subject: m.key,
                    subjectLabel: m.name,
                    count: 10,
                    mode: "practice",
                  })
                }
              >
                <MaterialCommunityIcons name={m.icon} size={24} color="#6a0dad" />
                <Text style={styles.subjectText}>{m.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 🔥 ESPACIADOR para scroll completo */}
        <View style={{ height: 140 }} />

      </ScrollWrapper>

      {/* MODAL PERSONALIZADO */}
      <CustomPracticeModal
        visible={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        navigation={navigation}
      />
    </LinearGradient>
  );
}

// 🎨 ESTILOS — IGUALES
const styles = StyleSheet.create({
  container: { flex: 1 },

  homeBtn: {
    position: "absolute",
    top: 48,
    left: 16,
    zIndex: 40,
    backgroundColor: "rgba(255,255,255,0.18)",
    padding: 8,
    borderRadius: 50,
  },

  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    color: "#f0f0f0",
    fontSize: 16,
    marginBottom: 22,
    textAlign: "center",
  },

  optionCard: {
    backgroundColor: "#6a0dad",
    width: "88%",
    alignSelf: "center",
    paddingVertical: 20,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 18,
  },

  optionTitle: { fontSize: 18, color: "#fff", fontWeight: "600", marginTop: 8 },
  optionText: { fontSize: 14, color: "#ddd", marginTop: 4 },

  subjectList: {
    width: "92%",
    backgroundColor: "#fff",
    alignSelf: "center",
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
  subjectText: { fontSize: 16, color: "#333", marginLeft: 8 },

  customCard: {
    backgroundColor: "#650dadff",
    padding: 20,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#6a0dad",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  customIconBox: {
    width: 55,
    height: 55,
    borderRadius: 10,
    backgroundColor: "#6a0dad",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  customIcon: { color: "white", fontSize: 30, fontWeight: "bold" },

  customTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
  customSubtitle: { color: "#c9c9e8", marginTop: 4 },
});
