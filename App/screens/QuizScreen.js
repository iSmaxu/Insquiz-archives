// App/screens/QuizScreen.js
// ==========================================================
//  INSQUIZ - QuizScreen (10/50 preguntas / práctica normal)
// ==========================================================

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Alert,
} from "react-native";
import QuestionCard from "../components/QuestionCard";
import { getQuestionsBySubject, getCombinedPool } from "../services/quizService";
import { saveResultSession } from "../services/resultService";
import { registerStats } from "../services/statsService";

export default function QuizScreen({ route, navigation }) {
  const {
    subject = "all",
    count = 10,
    mode = "practice",
    subjectLabel,
  } = route.params || {};

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0); // correctas reales
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const headerTitle = subjectLabel || subject.toUpperCase();

  // 🔹 Botón salir
  const handleExit = () => {
    Alert.alert(
      "Salir del Quiz",
      "¿Deseas salir? Perderás tu progreso.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salir",
          style: "destructive",
          onPress: () => navigation.navigate("PracticeMenuScreen"),
        },
      ]
    );
  };

  useEffect(() => {
    let pool;

    if (subject === "all") {
      pool = getCombinedPool(Math.ceil(count / 5));
    } else {
      pool = getQuestionsBySubject(subject, { limit: count });
    }

    setQuestions(pool);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleNext = (wasCorrect, selected, _ignored, isLast) => {
    const newScore = wasCorrect ? score + 1 : score;
    setScore(newScore);

    if (isLast) {
      finishQuiz(newScore);
      return;
    }

    setIndex((i) => i + 1);
  };

  const finishQuiz = async (correct) => {
    try {
      const total = questions.length;
      const date = new Date().toISOString();

      // 🔹 Guardar en ResultService unificado (/500)
      await saveResultSession({
        mode: mode || "practice",
        subject,
        area: subjectLabel || subject,
        correct,
        total,
        date,
      });

      // 🔹 Registrar estadísticas
      await registerStats("practice", subject, correct, total);

      // 🔹 Navegar a ResultScreen
      navigation.replace("ResultScreen", {
        score: correct,
        total,
        area: subjectLabel || subject,
        mode: mode || "practice",
      });
    } catch (error) {
      console.error("Error finishing quiz:", error);
      navigation.replace("ResultScreen", {
        score: correct,
        total: questions.length,
        area: subjectLabel || subject,
      });
    }
  };

  const current = questions[index];

  if (!current) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Cargando preguntas...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* 🔹 BOTÓN SALIR */}
      <TouchableOpacity style={styles.exitBtn} onPress={handleExit}>
        <Text style={styles.exitText}>Salir ✖</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={styles.header}>Práctica ({headerTitle})</Text>

        <QuestionCard
          question={current}
          index={index}
          total={questions.length}
          onNext={handleNext}
          currentScore={score}
        />
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },

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
  exitText: {
    color: "#d62828",
    fontWeight: "bold",
    fontSize: 14,
  },

  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6a0dad",
    marginBottom: 10,
    textAlign: "center",
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#6a0dad", fontSize: 16 },
});
