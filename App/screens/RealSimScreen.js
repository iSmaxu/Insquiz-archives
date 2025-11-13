// App/screens/RealSimScreen.js
// ==========================================================
// INSQUIZ - RealSimScreen (versión completa)
// ==========================================================
// Ejecuta simulacros globales combinando todas las materias.
// Registra resultados en resultService y Achievements.
// ==========================================================

import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Animated, ScrollView } from "react-native";
import QuestionCard from "../components/QuestionCard";
import ResultModal from "../components/ResultModal";
import { getCombinedPool } from "../services/quizService";
import { saveResultSession } from "../services/resultService";
import { registerStats } from "../services/statsService";

export default function RealSimScreen({ navigation }) {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [sessionStart] = useState(Date.now());
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ==========================================================
  // CARGA DE SIMULACRO
  // ==========================================================
  useEffect(() => {
    const pool = getCombinedPool(10);
    setQuestions(pool);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  // ==========================================================
  // MANEJO DE RESPUESTAS
  // ==========================================================
  const handleNext = async (wasCorrect) => {
    if (wasCorrect) setScore((s) => s + 1);
    if (index + 1 < questions.length) setIndex(index + 1);
    else await finishSim();
  };

  // ==========================================================
  // FINALIZA SIMULACRO
  // ==========================================================
  const finishSim = async () => {
    const total = questions.length;
    const accuracy = (score / total) * 100;
    const duration = ((Date.now() - sessionStart) / 1000).toFixed(1);

    await saveResultSession({
      subject: "mixto",
      score,
      total,
      accuracy,
      duration,
      date: new Date().toISOString(),
      type: "realsim",
    });

    await registerStats("realsim", "mixto", score, total);
    // navegar a pantalla de resultados
    navigation.replace("Result", { score, total, area: "Simulacro General" });
  };

  // ==========================================================
  // RENDERIZADO
  // ==========================================================
  const current = questions[index];
  if (!current) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Preparando simulacro...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBox}>
        <Text style={styles.header}>🎓 Simulacro Real</Text>
        <Text style={styles.subHeader}>Evaluación Mixta</Text>
        <Text style={styles.progressText}>
          Pregunta {index + 1} / {questions.length}
        </Text>
      </View>

      <QuestionCard
        question={current}
        index={index}
        total={questions.length}
        onNext={handleNext}
        bankStatus="local"
      />

      {showResult && (
        <ResultModal
          visible={showResult}
          score={score}
          total={questions.length}
          subject="Simulacro General"
          onClose={() => {
            setShowResult(false);
            navigation.navigate("Achievements");
          }}
        />
      )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  scrollContent: { padding: 16, paddingBottom: 40, flexGrow: 1 },
  headerBox: { alignItems: "center", marginBottom: 10 },
  header: { fontSize: 22, fontWeight: "bold", color: "#6a0dad" },
  subHeader: { fontSize: 16, color: "#555" },
  progressText: { fontSize: 14, color: "#777", marginTop: 4 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "bold", color: "#6a0dad" },
});
