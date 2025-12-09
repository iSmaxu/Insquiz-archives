// ==========================================================
//  INSQUIZ - Modo Adaptativo REAL (Difficulty Engine v2)
//  Con ScrollWrapper (barra sutil tipo Google)
// ==========================================================

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";

import QuestionCard from "../components/QuestionCard";
import masterQuestions from "../data/insquiz_master";

import { useOffline } from "../context/OfflineContext";

import {
  XP_Add,
  XP_PER_CORRECT,
  XP_SESSION_BONUS_10,
} from "../engines/XP_Engine";

import ScrollWrapper from "../components/ScrollWrapper"; // ← NUEVO

// ==========================================================
//  SISTEMA DE DIFICULTAD ADAPTATIVA
// ==========================================================

// Niveles permitidos
const LEVELS = ["easy", "medium", "hard"];

// Función para obtener preguntas por dificultad
function getQuestionsByDifficulty(level, usedIds = []) {
  const pool = masterQuestions.filter(
    (q) =>
      q.difficulty &&
      q.difficulty.toLowerCase() === level &&
      !usedIds.includes(q.id)
  );

  if (!pool.length) return null;

  // Mezclar
  return pool.sort(() => Math.random() - 0.5);
}

// ==========================================================
//  SCREEN PRINCIPAL
// ==========================================================

export default function AdaptivePracticeScreen({ navigation }) {
  const { setQuizActive } = useOffline();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [level, setLevel] = useState("medium"); // nivel inicial
  const [usedIds, setUsedIds] = useState([]);   // para no repetir preguntas
  const [streakCorrect, setStreakCorrect] = useState(0);
  const [streakWrong, setStreakWrong] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  // Activar protección offline
  useEffect(() => {
    setQuizActive(true);
    return () => setQuizActive(false);
  }, []);

  // Fade-in al cargar pantalla
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // ==========================================================
  //  Cargar preguntas iniciales
  // ==========================================================
  useEffect(() => {
    loadNewQuestionBatch("medium");
  }, []);

  function loadNewQuestionBatch(targetLevel) {
    const batch = getQuestionsByDifficulty(targetLevel, usedIds);

    if (!batch) {
      alert("No quedan preguntas disponibles para este nivel.");
      navigation.goBack();
      return;
    }

    // 5 preguntas por lote
    const slice = batch.slice(0, 5);

    setQuestions(slice);
    setUsedIds((prev) => [...prev, ...slice.map((q) => q.id)]);
    setIndex(0);
  }

  if (!questions.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>No se pudieron cargar preguntas.</Text>
      </View>
    );
  }

  const current = questions[index];

  // ==========================================================
  //  Manejo de Respuesta
  // ==========================================================
  async function handleAnswer(wasCorrect) {
    if (wasCorrect) {
      await XP_Add(XP_PER_CORRECT);
      setScore((s) => s + 1);
      setStreakCorrect((s) => s + 1);
      setStreakWrong(0);
    } else {
      setStreakWrong((s) => s + 1);
      setStreakCorrect(0);
    }

    // ---------------------------------------------
    // CAMBIO DE DIFICULTAD
    // ---------------------------------------------
    if (streakCorrect + 1 >= 2 && wasCorrect) {
      changeDifficulty(+1);
    }

    if (streakWrong + 1 >= 2 && !wasCorrect) {
      changeDifficulty(-1);
    }

    // ---------------------------------------------
    // SIGUIENTE PREGUNTA
    // ---------------------------------------------
    if (index + 1 === questions.length) {
      loadNewQuestionBatch(level);
    } else {
      setIndex((i) => i + 1);
    }
  }

  // ==========================================================
  //  Cambiar dificultad según +/-1
  // ==========================================================
  function changeDifficulty(delta) {
    const pos = LEVELS.indexOf(level);
    let newPos = pos + delta;

    if (newPos < 0) newPos = 0;
    if (newPos > LEVELS.length - 1) newPos = LEVELS.length - 1;

    const newLevel = LEVELS[newPos];
    setLevel(newLevel);
  }

  // ==========================================================
  //  FINALIZAR SESIÓN ADAPTATIVA
  // ==========================================================

  async function endSession() {
    await XP_Add(XP_SESSION_BONUS_10);

    navigation.replace("HomeScreen", {
      score,
      total: usedIds.length,
      area: "Modo Adaptativo",
      mode: "adaptive",
    });
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* BOTÓN SALIR */}
      <TouchableOpacity style={styles.exitBtn} onPress={() => endSession()}>
        <Text style={styles.exitText}>Salir ✖</Text>
      </TouchableOpacity>

      {/* SCROLL + INDICADOR */}
      <ScrollWrapper style={styles.scrollContent}>
        <Text style={styles.header}>🧠 Modo Adaptativo</Text>

        <Text style={styles.sub}>
          Nivel actual:{" "}
          <Text style={{ fontWeight: "bold", color: "#6a0dad" }}>
            {level.toUpperCase()}
          </Text>
        </Text>

        <Text style={styles.progress}>
          Pregunta {index + 1} de {questions.length}
        </Text>

        {/* TARJETA */}
        <QuestionCard
          question={current}
          selected={null}
          disabled={false}
          showAnswer={false}
          onSelect={() => {}}
          onNext={(wasCorrect) => handleAnswer(wasCorrect)}
        />
      </ScrollWrapper>
    </Animated.View>
  );
}

// ==========================================================
//  ESTILOS
// ==========================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },

  scrollContent: {
    padding: 16,
    paddingTop: 60,
    paddingBottom: 40,
  },

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

  exitText: { color: "#d62828", fontWeight: "bold" },

  header: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#6a0dad",
    marginBottom: 8,
  },

  sub: {
    textAlign: "center",
    color: "#555",
    marginBottom: 6,
  },

  progress: {
    textAlign: "center",
    color: "#777",
    marginBottom: 10,
  },

  error: {
    color: "#6a0dad",
    fontSize: 18,
    fontWeight: "bold",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
