// App/services/adaptiveService.js
// ==========================================================
//  INSQUIZ - Adaptive Service (Versión FINAL 2025)
// ==========================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import masterQuestions from "../data/converted_questions/insquiz_master.js";

// Clasificar por dificultad real
export const EASY = masterQuestions.filter(
  (q) => q.difficulty?.toLowerCase() === "easy"
);

export const MEDIUM = masterQuestions.filter(
  (q) => q.difficulty?.toLowerCase() === "medium"
);

export const HARD = masterQuestions.filter(
  (q) => q.difficulty?.toLowerCase() === "hard"
);
const FALLBACK = MEDIUM.length ? MEDIUM : InsquizMaster;

// Elegir aleatorio
function pickRandom(pool) {
  const p = pool.length ? pool : FALLBACK;
  return p[Math.floor(Math.random() * p.length)];
}

// ==========================================================
// Generar el examen adaptativo
// ==========================================================
export function generateAdaptiveQuizLocal(start = "medium", total = 20) {
  let quiz = [];
  const used = new Set();
  let level = start;

  for (let i = 0; i < total; i++) {
    let pool =
      level === "easy" ? EASY :
      level === "hard" ? HARD :
      MEDIUM;

    let q = pickRandom(pool);
    let tries = 0;

    while (used.has(q.id) && tries < 20) {
      q = pickRandom(pool);
      tries++;
    }

    used.add(q.id);
    quiz.push(q);
  }

  return { quiz, level };
}

// ==========================================================
// Guardar estadísticas
// ==========================================================
export async function saveAdaptiveStats(score, total) {
  try {
    const raw = await AsyncStorage.getItem("adaptiveStats");
    const prev = raw ? JSON.parse(raw) : { sessions: 0, totalScore: 0, totalQuestions: 0 };

    const updated = {
      sessions: prev.sessions + 1,
      totalScore: prev.totalScore + score,
      totalQuestions: prev.totalQuestions + total,
      last: { score, total, date: new Date().toISOString() },
    };

    await AsyncStorage.setItem("adaptiveStats", JSON.stringify(updated));
  } catch (err) {
    console.log("Adaptive save error:", err);
  }
}

export async function getAdaptiveStats() {
  try {
    const raw = await AsyncStorage.getItem("adaptiveStats");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function resetAdaptiveStats() {
  try {
    await AsyncStorage.removeItem("adaptiveStats");
  } catch {}
}
