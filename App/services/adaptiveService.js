// App/services/adaptiveService.js
// ==========================================================
// INSQUIZ - Adaptive Service (versión 2025 FINAL depurada)
// ==========================================================
// Genera preguntas adaptativas SIN depender de quizService.
// Filtra solo las que tengan contexto REAL en los textos locales.
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
// 🔹 Verifica si el contexto existe en los textos reales
// ==========================================================
function contextExists(subjectKey, contextTitle) {
  if (!contextTitle || !subjectKey) return false;
  const textos = TEXTOS_MAP[subjectKey] || [];
  const found = textos.some(
    (t) => t.context_title?.trim() === contextTitle.trim()
  );
  return found;
}

// ==========================================================
// 🔹 Fusión de preguntas con contextos
// ==========================================================
function mergeQuestions(subjectKey, questions) {
  const textos = TEXTOS_MAP[subjectKey] || [];
  return questions.map((q, i) => {
    const contexto =
      q.context ||
      (textos[Math.floor(Math.random() * textos.length)]?.texto ?? "");
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
// 🧠 Generador adaptativo (solo contextos válidos y existentes)
// ==========================================================
export function generateAdaptiveQuizLocal(startLevel = "medium", total = 20) {
  const allSubjects = Object.keys(masterData);
  const combined = [];

  for (const subject of allSubjects) {
    const merged = mergeQuestions(subject, masterData[subject]);
    combined.push(...merged);
  }

  // ❗ Filtrar solo las preguntas que tengan contexto válido y real
  const validQuestions = combined.filter(
    (q) =>
      q.context &&
      typeof q.context === "string" &&
      q.context.trim().length > 5 &&
      !q.context.includes("Texto no disponible") &&
      !q.context.includes("Sin texto") &&
      contextExists(q.subject, q.context)
  );

  // Clasificación por dificultad
  const easy = validQuestions.filter((q) => q.difficulty === "easy");
  const medium = validQuestions.filter((q) => q.difficulty === "medium");
  const hard = validQuestions.filter((q) => q.difficulty === "hard");

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

  // 🔁 Generación segura
  for (let i = 0; i < total; i++) {
    let next = getNext(currentLevel);
    let attempts = 0;
    while (
      (!next?.context ||
        next.context.trim() === "" ||
        !contextExists(next.subject, next.context)) &&
      attempts < 10
    ) {
      next = getNext(currentLevel);
      attempts++;
    }
    if (
      next?.context &&
      next.context.trim().length > 5 &&
      contextExists(next.subject, next.context)
    ) {
      quiz.push(next);
    }
  }

  console.log(`✅ Generadas ${quiz.length} preguntas con contexto real.`);
  return { quiz, currentLevel };
}

// ==========================================================
// 💾 Estadísticas locales adaptativas
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
    console.log("🧹 Estadísticas adaptativas reseteadas.");
  } catch (e) {
    console.warn("Error al resetear adaptive stats:", e);
  }
}
