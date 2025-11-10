// App/screens/AdaptivePracticeScreen.js
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import QuestionCard from "../components/QuestionCard";
import {
  generateAdaptiveQuizLocal,
  saveAdaptiveStats,
} from "../services/adaptiveService";

export default function AdaptivePracticeScreen({ navigation }) {
  const [data, setData] = useState(() => generateAdaptiveQuizLocal("medium", 20));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState("medium");
  const [streak, setStreak] = useState(0);

  const total = data.quiz.length;
  const current = data.quiz[index];

  const handleNext = async (wasCorrect) => {
    if (wasCorrect) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      if (streak + 1 >= 3 && level !== "hard") setLevel("hard");
    } else {
      setStreak(0);
      if (level === "hard") setLevel("medium");
      else if (level === "medium") setLevel("easy");
    }

    if (index + 1 < total) {
      setIndex(index + 1);
    } else {
      await saveAdaptiveStats(score, total);
      navigation.navigate("Result", {
        score,
        total,
        area: "Modo Adaptativo",
      });
    }
  };

  if (!current) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Cargando preguntas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🧠 Modo Adaptativo</Text>
      <Text style={styles.sub}>
        Nivel actual:{" "}
        <Text style={{ fontWeight: "bold", color: "#6a0dad" }}>
          {level.toUpperCase()}
        </Text>
      </Text>
      <Text style={styles.progress}>
        Pregunta {index + 1} de {total}
      </Text>

      <QuestionCard
        question={current}
        index={index}
        total={total}
        onNext={handleNext}
        bankStatus="adaptive"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fafafa" },
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
