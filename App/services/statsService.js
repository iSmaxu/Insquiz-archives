// App/services/statsService.js
// ==========================================================
// INSQUIZ - Stats Service v3 (unificado y completo)
// ==========================================================
// Guarda estadísticas locales de todos los modos de práctica:
//  - Modo Normal (QuizScreen)
//  - Modo RealSim (Simulacros)
//  - Modo Adaptativo
// ==========================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "stats_v3";

/**
 * Obtiene todas las estadísticas generales
 */
export async function getStats() {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn("Error leyendo estadísticas:", e);
    return null;
  }
}

/**
 * Registra los resultados de una sesión (práctica, simulacro o adaptativo)
 * @param {string} mode - 'practice' | 'realsim' | 'adaptive'
 * @param {string} subject - materia (lectura, matematicas, etc.)
 * @param {number} correct - respuestas correctas
 * @param {number} total - total de preguntas respondidas
 * @param {string} [bestSkill] - habilidad destacada (opcional)
 */
export async function registerStats(mode, subject, correct, total, bestSkill = null) {
  try {
    const saved = await getStats();
    const stats = saved || {
      totalAnswered: 0,
      totalCorrect: 0,
      subjects: {},
      modes: {
        practice: { sessions: 0, correct: 0, total: 0 },
        realsim: { sessions: 0, correct: 0, total: 0 },
        adaptive: { sessions: 0, correct: 0, total: 0 },
      },
      bestSkill: "",
    };

    // Totales globales
    stats.totalAnswered += total;
    stats.totalCorrect += correct;

    // Por materia
    if (!stats.subjects[subject]) stats.subjects[subject] = { correct: 0, total: 0 };
    stats.subjects[subject].correct += correct;
    stats.subjects[subject].total += total;

    // Por modo
    if (!stats.modes[mode]) stats.modes[mode] = { sessions: 0, correct: 0, total: 0 };
    stats.modes[mode].sessions += 1;
    stats.modes[mode].correct += correct;
    stats.modes[mode].total += total;

    // Habilidad destacada
    if (bestSkill) stats.bestSkill = bestSkill;

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.warn("Error guardando estadísticas:", e);
  }
}

/**
 * Resetea todas las estadísticas locales
 */
export async function resetStats() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log("🧹 Estadísticas reiniciadas.");
  } catch (e) {
    console.warn("Error reseteando estadísticas:", e);
  }
}
