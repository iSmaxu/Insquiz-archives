// App/screens/QuizScreen.js
// ==========================================================
// INSQUIZ - QuizScreen con ScrollWrapper optimizado
// y carga ASÍNCRONA de preguntas + soporte multi-modo
// ==========================================================

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import ScrollWrapper from "../components/ScrollWrapper";
import { XP_Add, XP_PER_CORRECT } from "../engines/XP_Engine";
import { getQuestions, getQuizByMode } from "../services/quizService";
import QuestionCard from "../components/QuestionCard";

export default function QuizScreen({ route, navigation }) {
  const { subject, count, subjectLabel, mode } = route.params;

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        // 1️⃣ Si vienen preguntas inyectadas (RealSim, custom, etc.)
        if (route.params?.questions) {
          if (isMounted) {
            setQuestions(route.params.questions);
            setLoading(false);
          }
          return;
        }

        // 2️⃣ Modos normales usando quizService
        let qs = [];

        if (mode && mode !== "classic" && mode !== "custom") {
          qs = await getQuizByMode(mode, subject, count || 10);
        } else {
          qs = await getQuestions(subject, count || 10);
        }

        if (isMounted) {
          setQuestions(Array.isArray(qs) ? qs : []);
        }
      } catch (e) {
        console.log("❌ Error cargando preguntas en QuizScreen:", e);
        if (isMounted) {
          setQuestions([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [route.params, subject, count, mode]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6a0dad" />
        <Text style={{ marginTop: 10 }}>Cargando preguntas…</Text>
      </View>
    );
  }

  if (!questions || !questions.length) {
    return (
      <View style={styles.center}>
        <Text>No se recibieron preguntas.</Text>
      </View>
    );
  }

  const current = questions[index];

  // ============================================
  //  MANEJO DE SIGUIENTE PREGUNTA
  // ============================================
  async function handleNext({ wasCorrect }) {
    let nextScore = score;

    if (wasCorrect) {
      nextScore = score + 1;
      setScore(nextScore);
      await XP_Add(XP_PER_CORRECT);
    }

    const lastIndex = questions.length - 1;

    if (index === lastIndex) {
      navigation.replace("ResultScreen", {
        score: nextScore,
        total: questions.length,
        area: subjectLabel,
        mode,
      });
    } else {
      setIndex((i) => i + 1);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <ScrollWrapper style={{ paddingHorizontal: 18, paddingTop: 50 }}>
        <Text style={styles.header}>{subjectLabel}</Text>
        <Text style={styles.progress}>
          Pregunta {index + 1} de {questions.length}
        </Text>

        <QuestionCard
          question={current}
          index={index}
          total={questions.length}
          onNext={handleNext}
        />
      </ScrollWrapper>

      <TouchableOpacity
        style={styles.exitBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.exitText}>Salir ✖</Text>
      </TouchableOpacity>
    </View>
  );
}

// ==========================================================
//  ESTILOS
// ==========================================================
const styles = StyleSheet.create({
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#6a0dad",
    textAlign: "center",
  },
  progress: {
    textAlign: "center",
    marginBottom: 10,
    color: "#555",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  exitBtn: {
    position: "absolute",
    top: 35,
    right: 12,
    backgroundColor: "rgba(255,0,0,0.12)",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  exitText: {
    color: "#c62828",
    fontWeight: "bold",
  },
});
