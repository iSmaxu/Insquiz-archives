// App/services/statsService.js
// ==========================================================
//  INSQUIZ - Stats Service (versión segura, nunca null)
// ==========================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "INSQUIZ_STATS";

/**
 * Estructura segura inicial
 */
const DEFAULT_STATS = {
  totalAnswered: 0,
  totalCorrect: 0,
  modes: {},        // ej: { practice:{total,correct}, realsim:{...} }
  subjects: {},     // ej: { matematicas:{total,correct} }
  skills: {},       // ej: { algebra:{total,correct} }
  bestPerfect: 0,   // racha de respuestas perfectas en un quiz
};

/**
 * Devuelve SIEMPRE un objeto válido.
 */
export async function getStats() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_STATS };

    const parsed = JSON.parse(raw);

    return {
      totalAnswered: parsed.totalAnswered ?? 0,
      totalCorrect: parsed.totalCorrect ?? 0,
      modes: parsed.modes ?? {},
      subjects: parsed.subjects ?? {},
      skills: parsed.skills ?? {},
      bestPerfect: parsed.bestPerfect ?? 0,
    };
  } catch (e) {
    console.log("❌ Error leyendo stats:", e);
    return { ...DEFAULT_STATS };
  }
}

/**
 * Registra un quiz/actividad.
 * mode = "practice", "realsim", etc.
 * subject = "matematicas", "lectura", etc.
 */
export async function registerStats(mode, subject, correct, total) {
  const stats = await getStats();

  stats.totalAnswered += total;
  stats.totalCorrect += correct;

  // modos
  if (!stats.modes[mode]) {
    stats.modes[mode] = { total: 0, correct: 0 };
  }
  stats.modes[mode].total += total;
  stats.modes[mode].correct += correct;

  // materias
  if (!stats.subjects[subject]) {
    stats.subjects[subject] = { total: 0, correct: 0 };
  }
  stats.subjects[subject].total += total;
  stats.subjects[subject].correct += correct;

  // mejor quiz perfecto (correct == total)
  if (correct === total && total > stats.bestPerfect) {
    stats.bestPerfect = total;
  }

  await AsyncStorage.setItem(KEY, JSON.stringify(stats));
  return stats;
}

export async function resetStats() {
  await AsyncStorage.setItem(KEY, JSON.stringify(DEFAULT_STATS));
}
