// App/screens/RealSimScreen.js
// ==========================================================
//  INSQUIZ - RealSimScreen (390 preguntas + review)
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
import { getMixedQuestions } from "../services/quizService";
import { saveResultSession } from "../services/resultService";
import { registerStats } from "../services/statsService";

export default function RealSimScreen({ navigation }) {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0); // ✔ correctas
  const [answers, setAnswers] = useState([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // 🔹 Botón salir del simulacro
  const handleExit = () => {
    Alert.alert(
      "Salir del modo Simulacro Real",
      "Perderás tu progreso actual. ¿Deseas salir?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salir",
          style: "destructive",
          onPress: () => navigation.navigate("Home"),
        },
      ]
    );
  };

  useEffect(() => {
    // 390 preguntas: 78 por materia (LQ, MT, CN, CS, EN)
    const pool = getMixedQuestions(["LQ", "MT", "CN", "CS", "EN"], 78);
    setQuestions(pool);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleNext = (wasCorrect, userAnswer, _finalScoreFromCard, isLast) => {
    const q = questions[index];

    // ✔ Actualizamos score local
    const newScore = wasCorrect ? score + 1 : score;
    setScore(newScore);

    // ✔ Construimos el array de respuestas con la última incluida
    const newAnswerEntry = {
      id: q.id,
      question: q.question,
      selected: userAnswer,
      correctAnswer: q.answer,
      correct: wasCorrect,
      context_text: q.context_text,
      justification: q.justification,
      options: q.options,
    };

    const updatedAnswers = [...answers, newAnswerEntry];
    setAnswers(updatedAnswers);

    // Si es la última pregunta, finalizar simulacro
    if (isLast) {
      finishSim(newScore, updatedAnswers);
      return;
    }

    // Si no, avanzar a la siguiente
    setIndex((i) => i + 1);
  };

  const finishSim = async (correct, finalAnswers) => {
    try {
      const total = questions.length;
      const date = new Date().toISOString();

      // 🔹 Guardar en ResultService unificado (/500)
      await saveResultSession({
        mode: "realsim",
        subject: "simulacro",
        area: "Simulacro Real",
        correct,
        total,
        date,
        meta: {
          poolSubjects: ["LQ", "MT", "CN", "CS", "EN"],
        },
      });

      // 🔹 Registrar estadísticas para Achievements
      await registerStats("realsim", "simulacro", correct, total);

      // 🔹 Navegar a la pantalla de revisión del simulacro
      navigation.replace("RealSimReviewScreen", {
        questions,
        answers: finalAnswers,
        score: correct, // correctas totales
      });
    } catch (error) {
      console.error("Error finishing sim:", error);
      navigation.replace("RealSimReviewScreen", {
        questions,
        answers: finalAnswers,
        score: correct,
      });
    }
  };

  const current = questions[index];

  if (!current) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Preparando simulacro (390 preguntas)...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* 🔹 BOTÓN SALIR */}
      <TouchableOpacity style={styles.exitBtn} onPress={handleExit}>
        <Text style={styles.exitText}>Salir ✖</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerBox}>
          <Text style={styles.header}>🎓 Simulacro Real</Text>
          <Text style={styles.sub}>390 preguntas tipo examen</Text>
          <Text style={styles.progress}>
            Pregunta {index + 1} / {questions.length}
          </Text>
        </View>

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

  scroll: { padding: 16, paddingBottom: 40 },
  headerBox: { alignItems: "center", marginBottom: 10 },
  header: { fontSize: 22, fontWeight: "bold", color: "#6a0dad" },
  sub: { fontSize: 16, color: "#555" },
  progress: { fontSize: 14, color: "#777", marginTop: 4 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 17, color: "#6a0dad", fontWeight: "700" },
});
