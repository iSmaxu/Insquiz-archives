// App/services/statsService.js
// ==========================================================
// INSQUIZ - Stats Service v2 (backend real, consistente)
// ==========================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@insquiz_stats_v2";

// ------------------------
// ESTRUCTURA BASE
// ------------------------
const DEFAULT_STATS = {
  totalAnswered: 0,
  totalCorrect: 0,

  modes: {
    // practice: { total, correct }
    // realsim: { total, correct }
  },

  subjects: {
    // matematicas: { total, correct }
  },

  skills: {
    // algebra: { total, correct }
  },

  bestPerfect: 0, // mejor quiz perfecto (n preguntas sin error)
};

// ------------------------
// LECTURA SEGURA
// ------------------------
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

// ------------------------
// REGISTRO DE QUIZ COMPLETO
// ------------------------
/**
 * Registra un quiz COMPLETO (una sola llamada).
 *
 * @param {Object} params
 * @param {string} params.mode        - "practice" | "realsim" | etc
 * @param {string} params.subject     - "matematicas", etc
 * @param {number} params.correct     - respuestas correctas
 * @param {number} params.total       - total de preguntas
 * @param {Array}  params.questions   - array de preguntas respondidas
 *        cada una puede tener { skill, wasCorrect }
 */
export async function registerStats({
  mode,
  subject,
  correct,
  total,
  questions = [],
}) {
  const stats = await getStats();

  // ------------------------
  // GLOBAL
  // ------------------------
  stats.totalAnswered += total;
  stats.totalCorrect += correct;

  // ------------------------
  // MODOS
  // ------------------------
  if (!stats.modes[mode]) {
    stats.modes[mode] = { total: 0, correct: 0 };
  }
  stats.modes[mode].total += total;
  stats.modes[mode].correct += correct;

  // ------------------------
  // MATERIAS
  // ------------------------
  if (subject) {
    if (!stats.subjects[subject]) {
      stats.subjects[subject] = { total: 0, correct: 0 };
    }
    stats.subjects[subject].total += total;
    stats.subjects[subject].correct += correct;
  }

  // ------------------------
  // SKILLS (por pregunta)
  // ------------------------
  questions.forEach((q) => {
    if (!q.skill) return;

    if (!stats.skills[q.skill]) {
      stats.skills[q.skill] = { total: 0, correct: 0 };
    }

    stats.skills[q.skill].total += 1;
    if (q.wasCorrect) {
      stats.skills[q.skill].correct += 1;
    }
  });

  // ------------------------
  // PERFECT QUIZ
  // ------------------------
  if (correct === total && total > stats.bestPerfect) {
    stats.bestPerfect = total;
  }

  await AsyncStorage.setItem(KEY, JSON.stringify(stats));
  return stats;
}

// ------------------------
// RESET (DEV / OPCIONAL)
// ------------------------
export async function resetStats() {
  await AsyncStorage.setItem(KEY, JSON.stringify(DEFAULT_STATS));
}
