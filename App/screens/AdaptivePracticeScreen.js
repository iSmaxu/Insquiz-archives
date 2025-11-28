// App/screens/AdaptivePracticeScreen.js (FIX)
// ==========================================================
//  INSQUIZ - Modo Adaptativo (20 preguntas dinámicas)
// ==========================================================

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Animated } from "react-native";
import QuestionCard from "../components/QuestionCard";
import { generateAdaptiveQuizLocal, saveAdaptiveStats } from "../services/adaptiveService";

export default function AdaptivePracticeScreen({ navigation }) {

  const [state, setState] = useState(() => generateAdaptiveQuizLocal("medium", 20));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState("medium");
  const [streak, setStreak] = useState(0);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  // 🔹 FIX — hacer visible la pantalla
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // 🔹 PROTECCIÓN — si state está vacío
  if (!state || !state.quiz || state.quiz.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>No se pudieron cargar preguntas.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: "#6a0dad", marginTop: 10 }}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const total = state.quiz.length;
  const current = state.quiz[index];

  // 🔹 BOTÓN SALIR
  const handleExit = () => {
    Alert.alert(
      "Salir del modo adaptativo",
      "Perderás tu progreso actual. ¿Deseas salir?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Salir", style: "destructive", onPress: () => navigation.navigate("PracticeMenuScreen") }
      ]
    );
  };

  const handleNext = async (wasCorrect, selected, finalScore, isLast) => {
    if (wasCorrect) {
      setStreak((s) => s + 1);
      if (streak + 1 >= 3) setLevel("hard");
    } else {
      setStreak(0);
      if (level === "hard") setLevel("medium");
      else setLevel("easy");
    }

    if (isLast) {
      await saveAdaptiveStats(finalScore, total);

      navigation.replace("ResultScreen", {
        score: finalScore,
        total,
        area: "Modo Adaptativo",
      });
    } else {
      setIndex((i) => i + 1);
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>

      <TouchableOpacity style={styles.exitBtn} onPress={handleExit}>
        <Text style={styles.exitText}>Salir ✖</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>🧠 Modo Adaptativo</Text>
        <Text style={styles.sub}>
          Nivel actual: <Text style={{ fontWeight: "bold", color: "#6a0dad" }}>{level.toUpperCase()}</Text>
        </Text>
        <Text style={styles.progress}>Pregunta {index + 1} de {total}</Text>

        <QuestionCard
          question={current}
          index={index}
          total={total}
          onNext={handleNext}
          currentScore={score}
        />
      </ScrollView>

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  scrollContent: { padding: 16, paddingBottom: 40, paddingTop: 60, flexGrow: 1 },

  exitBtn: {
    position: "absolute",
    top: 45,
    right: 14,
    zIndex: 50,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,0,0,0.12)",
    borderRadius: 12,
  },
  exitText: { color: "#d62828", fontWeight: "bold", fontSize: 14 },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#6a0dad",
    marginBottom: 8,
  },
  sub: { textAlign: "center", color: "#555", marginBottom: 6 },
  progress: { textAlign: "center", color: "#777", marginBottom: 10 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 18, color: "#6a0dad", fontWeight: "bold" },
});
