// App/services/adaptiveService.js
// ==========================================================
// INSQUIZ - Adaptive Service (modo 100% independiente)
// ==========================================================
// Genera preguntas adaptativas sin depender de quizService.
// Usa el banco local InsQUIZ_master_reindexed.json y los
// textos contextualizados por materia.
// ==========================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import masterData from "../data/InsQUIZ_master_reindexed.json";

// Contextos locales
import textosLectura from "../data/textos/textos_lectura.json";
import textosMatematicas from "../data/textos/textos_matematicas.json";
import textosSociales from "../data/textos/textos_ciencias_sociales.json";
import textosNaturales from "../data/textos/textos_ciencias_naturales.json";
import textosIngles from "../data/textos/textos_ingles.json";

const TEXTOS_MAP = {
  lectura: textosLectura,
  matematicas: textosMatematicas,
  sociales: textosSociales,
  naturales: textosNaturales,
  ingles: textosIngles,
};

// ==========================================================
// 🔹 Fusión de preguntas con contextos
// ==========================================================
function mergeQuestions(subjectKey, questions) {
  const textos = TEXTOS_MAP[subjectKey] || [];
  return questions.map((q, i) => {
    const contexto =
      q.context || (textos[Math.floor(Math.random() * textos.length)]?.texto ?? "");
    return {
      id: q.id || `${subjectKey}-${i + 1}`,
      subject: subjectKey,
      context: contexto,
      question: q.question || "Sin texto de pregunta.",
      options: q.options || [],
      answer: q.answer || "",
      justification: q.justification || "Sin justificación disponible.",
      skill: q.skill || "Sin registro de habilidad.",
      difficulty: q.difficulty || "medium",
    };
  });
}

// ==========================================================
// 🧠 Generador de quiz adaptativo local
// ==========================================================
export function generateAdaptiveQuizLocal(startLevel = "medium", total = 20) {
  const allSubjects = Object.keys(masterData);
  const combined = [];

  // Funde todas las preguntas con sus contextos
  for (const subject of allSubjects) {
    const merged = mergeQuestions(subject, masterData[subject]);
    combined.push(...merged);
  }

  // Clasifica por dificultad
  const easy = combined.filter((q) => q.difficulty === "easy");
  const medium = combined.filter((q) => q.difficulty === "medium");
  const hard = combined.filter((q) => q.difficulty === "hard");

  let quiz = [];
  let currentLevel = startLevel;

  const getNext = (level) => {
    const pool =
      level === "easy"
        ? easy
        : level === "hard"
        ? hard.length
          ? hard
          : medium
        : medium;
    return pool[Math.floor(Math.random() * pool.length)];
  };

  for (let i = 0; i < total; i++) {
    quiz.push(getNext(currentLevel));
  }

  return { quiz, currentLevel };
}

// ==========================================================
// 💾 Estadísticas locales del modo adaptativo
// ==========================================================
export async function saveAdaptiveStats(score, total) {
  try {
    const saved = await AsyncStorage.getItem("adaptiveStats");
    const prev = saved
      ? JSON.parse(saved)
      : { sessions: 0, totalScore: 0, totalQuestions: 0 };

    const updated = {
      sessions: prev.sessions + 1,
      totalScore: prev.totalScore + score,
      totalQuestions: prev.totalQuestions + total,
      lastResult: { score, total, date: new Date().toISOString() },
    };

    await AsyncStorage.setItem("adaptiveStats", JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn("Error guardando adaptive stats:", e);
  }
}

export async function getAdaptiveStats() {
  try {
    const data = await AsyncStorage.getItem("adaptiveStats");
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn("Error leyendo adaptive stats:", e);
    return null;
  }
}

export async function resetAdaptiveStats() {
  try {
    await AsyncStorage.removeItem("adaptiveStats");
  } catch (e) {
    console.warn("Error al resetear adaptive stats:", e);
  }
}
