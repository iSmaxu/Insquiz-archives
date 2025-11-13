// App/screens/QuizScreen.js
// ==========================================================
// INSQUIZ - QuizScreen (2025)
// ==========================================================
// Compatible con context textual (context_title / context_text)
// ==========================================================
import React, { useContext, useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Animated, ScrollView } from "react-native";
import { QuizContext } from "../context/QuizContext";
import { prepareQuizFromSubject } from "../services/quizService";
import { saveResultSession } from "../services/resultService";
import { registerStats } from "../services/statsService";
import QuestionCard from "../components/QuestionCard";

export default function QuizScreen({ route, navigation }) {
  const { subjectKey = "lectura" } = route.params || {};
  const { updateProgress } = useContext(QuizContext);

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      console.log(`📘 Cargando preguntas para ${subjectKey}...`);
      const data = await prepareQuizFromSubject(subjectKey, 10);
      setQuestions(data);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    })();
  }, [subjectKey]);

  const handleNext = async (wasCorrect) => {
    if (wasCorrect) setScore((s) => s + 1);

    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
    } else {
      await finishQuiz();
    }
  };

  const finishQuiz = async () => {
    const total = questions.length;
    await saveResultSession({
      subject: subjectKey,
      score,
      total,
      accuracy: ((score / total) * 100).toFixed(1),
      date: new Date().toISOString(),
    });

    await registerStats("practice", subjectKey, score, total);
    updateProgress(subjectKey, score, total);
    // navegar a pantalla de resultados para revisión completa
    navigation.replace("Result", { score, total, area: subjectKey });
  };

  const current = questions[index];

  if (!current) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>Cargando preguntas...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
        <Text style={styles.headerTitle}>🧩 {subjectKey.toUpperCase()}</Text>
        <Text style={styles.progress}>
          Pregunta {index + 1} / {questions.length}
        </Text>
      </View>

      <QuestionCard
        question={current}
        index={index}
        total={questions.length}
        onNext={handleNext}
      />

      {showResult && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>
            ✅ Has completado el quiz con {score} / {questions.length} aciertos.
          </Text>
        </View>
      )}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  scrollContent: { padding: 16, paddingBottom: 40, flexGrow: 1 },
  header: { alignItems: "center", marginBottom: 8 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#6a0dad" },
  progress: { color: "#777", fontSize: 14 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loading: { fontSize: 16, color: "#6a0dad" },
  resultBox: {
    backgroundColor: "#eee",
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
  },
  resultText: { textAlign: "center", fontWeight: "bold", color: "#333" },
});
