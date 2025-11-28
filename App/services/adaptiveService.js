// App/services/adaptiveService.js
// ==========================================================
//  INSQUIZ - Adaptive Service (Versión FINAL 2025)
// ==========================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import { InsquizMaster } from "./quizService";

// Clasificar por dificultad real
const EASY = InsquizMaster.filter((q) => q.difficulty === "easy");
const MEDIUM = InsquizMaster.filter((q) => q.difficulty === "medium");
const HARD = InsquizMaster.filter((q) => q.difficulty === "hard");

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
