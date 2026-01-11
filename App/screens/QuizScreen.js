// App/screens/QuizScreen.js
// ==========================================================
// INSQUIZ - QuizScreen v5.3
// ✅ Compatible con preguntas CLÁSICAS y LEXICAL MATCHING
// ✅ QuestionCard decide CUÁNDO la pregunta termina
// ✅ QuizScreen decide QUÉ hacer con el resultado
// ✅ XP, stats, RealSim y anti doble-tap intactos
// ==========================================================

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import ScrollWrapper from "../components/ScrollWrapper";
import { registerStats } from "../services/statsService";
import QuestionCard from "../components/QuestionCard";

import { useInstructor } from "../instructor/InstructorProvider";
import { InstructorEvents } from "../instructor/InstructorEvents";

import { getQuestions, getQuizByMode } from "../services/quizService";
import { useOffline } from "../context/OfflineContext";
import { saveAttempt } from "../store/AttemptStore";

import {
  XP_Add,
  XP_PER_CORRECT,
  XP_SESSION_BONUS_10,
  XP_SESSION_BONUS_REALSIM,
} from "../engines/XP_Engine";

export default function QuizScreen({ route, navigation }) {
  const { subject, count, subjectLabel, mode } = route.params || {};
  const { setQuizActive } = useOffline();

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);



  const answeredRef = useRef([]);
  const lockRef = useRef(false); // anti doble evento

  // ----------------------------------------------------------
  // Declarar estado de quiz activo
  // ----------------------------------------------------------
  useEffect(() => {
    setQuizActive(true);
    return () => setQuizActive(false);
  }, [setQuizActive]);

  // ----------------------------------------------------------
  // Carga de preguntas
  // ----------------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);

      try {
        // 🔹 Preguntas inyectadas (RealSim / custom)
        if (route.params?.questions) {
          if (!isMounted) return;

          const arr = Array.isArray(route.params.questions)
            ? route.params.questions
            : [];

          setQuestions(arr);
          setIndex(0);
          setScore(0);
          answeredRef.current = [];
          return;
        }

        let qs = [];

        if (mode && mode !== "classic" && mode !== "custom") {
          qs = await getQuizByMode(mode, subject, count || 10);
        } else {
          qs = await getQuestions(subject, count || 10);
        }

        if (!isMounted) return;

        setQuestions(Array.isArray(qs) ? qs : []);
        setIndex(0);
        setScore(0);
        answeredRef.current = [];
      } catch (e) {
        console.log("❌ Error cargando preguntas:", e);
        if (isMounted) setQuestions([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [route.params, subject, count, mode]);

  // ----------------------------------------------------------
  // Loading / empty
  // ----------------------------------------------------------
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6a0dad" />
        <Text style={{ marginTop: 10 }}>Cargando preguntas…</Text>
      </View>
    );
  }

  if (!questions.length) {
    return (
      <View style={styles.center}>
        <Text>No se recibieron preguntas.</Text>
      </View>
    );
  }

  const current = questions[index];

  // ----------------------------------------------------------
  // 🔥 Evento FINAL de una pregunta
  // (clásica o lexical)
  // ----------------------------------------------------------
  async function handleNext(payload = {}) {
    if (lockRef.current) return;
    lockRef.current = true;

    try {
      // 🔹 Normalización defensiva
      const userLetter = (payload.letter || "A")
        .toString()
        .trim()
        .toUpperCase();

      const correctLetter = (current?.correct_letter || current?.answer || "A")
        .toString()
        .trim()
        .toUpperCase();

      const isCorrect = userLetter === correctLetter;

      let nextScore = score;

      // 🎯 XP por pregunta
      if (isCorrect) {
        
        nextScore = score + 1;

        setScore(nextScore);
        await XP_Add(XP_PER_CORRECT, { correct: true });
      } else {
        await XP_Add(0, { correct: false });
      }

      // 📌 Guardar pregunta respondida
      const answered = {
        ...current,
        userAnswer: userLetter,
        wasCorrect: isCorrect,
      };

      answeredRef.current = [...answeredRef.current, answered];

      const isLast = index === questions.length - 1;

      // ------------------------------------------------------
      // 🔚 Última pregunta → cerrar intento
      // ------------------------------------------------------
      if (isLast) {
        const attempt = {
          id: `ATT-${Date.now()}`,
          mode: mode || "classic",
          area: subjectLabel || subject || "Quiz",
          createdAt: Date.now(),
          questions: answeredRef.current,
          stats: {
            total: questions.length,
            correct: nextScore,
            incorrect: questions.length - nextScore,
          },
        };

        await saveAttempt(attempt);

        await registerStats({
          mode: mode || "practice",
          subject: subject || "general",
          correct: nextScore,
          total: questions.length,
          questions: answeredRef.current,
        });

        // 🎁 Bonus de sesión
        const bonus =
          (mode || "").toLowerCase() === "realsim"
            ? XP_SESSION_BONUS_REALSIM
            : XP_SESSION_BONUS_10;

        await XP_Add(bonus);

        navigation.replace("ResultScreen", {
          score: nextScore,
          total: questions.length,
          area: subjectLabel || subject,
          mode: mode || "classic",
          attemptId: attempt.id,
        });
      } else {
        // 👉 Siguiente pregunta
        setIndex((i) => i + 1);
      }
    } finally {
      setTimeout(() => {
        lockRef.current = false;
      }, 150);
    }
  }

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------
  return (
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <ScrollWrapper style={{ paddingHorizontal: 18, paddingTop: 50 }}>
        <Text style={styles.header}>
          {subjectLabel || subject}
        </Text>

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
// Styles
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
