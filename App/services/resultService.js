// App/services/resultService.js
// ==========================================================
// INSQUIZ - Servicio de Resultados e Historial Local (v2)
// ==========================================================
// - Unifica resultados de TODOS los modos (practice, adaptive, realsim)
// - Calcula puntaje sobre 500 (lineal: correct/total * 500)
// - Mantiene compatibilidad con Achievements y funciones existentes
// ==========================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

const HISTORY_KEY = "quizHistory";

/* ==========================================================
   🔹 Helper: calcular puntaje sobre 500 (lineal)
   ========================================================== */
export function calculateScore500(correct, total) {
  if (!total || total <= 0) return 0;
  const ratio = correct / total;
  return Math.round(ratio * 500);
}

/* ==========================================================
   🔹 Guardar un nuevo resultado (entrada principal)
   ========================================================== */
/**
 * Guarda una sesión de resultado unificada.
 * Admite payload NUEVO o LEGACY:
 *
 * NUEVO:
 *  {
 *    mode: "practice" | "adaptive" | "realsim",
 *    subject: "lectura" | "matematicas" | "simulacro" | "all",
 *    area?: "Lectura crítica",  // etiqueta bonita opcional
 *    correct: number,
 *    total: number,
 *    date?: string,
 *    meta?: any,                // cualquier extra
 *  }
 *
 * LEGACY (compatibilidad):
 *  {
 *    subject: string,
 *    score: number,   // se toma como correctas
 *    total: number,
 *    accuracy?: number,
 *    date?: string
 *  }
 */
export async function saveResultSession(payload) {
  try {
    const existing = await AsyncStorage.getItem(HISTORY_KEY);
    const history = existing ? JSON.parse(existing) : [];

    const {
      // NUEVO formato
      mode: rawMode,
      subject: rawSubject,
      area: rawArea,
      correct: rawCorrect,
      total: rawTotal,
      meta,

      // LEGACY
      score: legacyScore,
      accuracy: legacyAccuracy,
      area: legacyArea,
    } = payload || {};

    // ---- Normalización de campos ----
    // Modo
    const mode = rawMode || payload.mode || "practice";

    // Materia / área interna
    const subject = rawSubject || payload.subject || "general";

    // Etiqueta bonita para mostrar (área)
    const area = rawArea || legacyArea || payload.area || subject;

    // Correctas y total
    const correct =
      typeof rawCorrect === "number"
        ? rawCorrect
        : typeof legacyScore === "number"
        ? legacyScore
        : 0;

    const total =
      typeof rawTotal === "number"
        ? rawTotal
        : typeof payload.total === "number"
        ? payload.total
        : 0;

    // Accuracy (%)
    const accuracy =
      typeof legacyAccuracy === "number"
        ? legacyAccuracy
        : total > 0
        ? Number(((correct / total) * 100).toFixed(1))
        : 0;

    // Puntaje sobre 500
    const score500 = calculateScore500(correct, total);

    const newEntry = {
      mode,
      subject,        // clave interna (lectura, matematicas, simulacro, etc.)
      area,          // etiqueta visible (Lectura crítica, Simulacro Real, etc.)
      correct,
      total,
      accuracy,      // % correcto
      percentage: accuracy, // alias para compatibilidad
      score500,
      date: payload.date || new Date().toISOString(),
      meta: meta || null,
    };

    const updated = [newEntry, ...history];
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    console.log("✅ Resultado guardado (unificado):", newEntry);
  } catch (error) {
    console.error("❌ Error guardando resultado:", error);
  }
}

/* ==========================================================
   🔹 Obtener historial completo
   ========================================================== */
export async function getQuizHistory() {
  try {
    const data = await AsyncStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("❌ Error leyendo historial:", error);
    return [];
  }
}

/* ==========================================================
   🔹 Limpiar historial
   ========================================================== */
export async function clearQuizHistory() {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
    console.log("🧹 Historial de resultados eliminado.");
  } catch (error) {
    console.error("❌ Error limpiando historial:", error);
  }
}

/* ==========================================================
   🔹 Mejor resultado por materia (compat + nuevo)
   ========================================================== */
export async function getBestResultsBySubject() {
  try {
    const history = await getQuizHistory();
    if (!history.length) return {};

    const grouped = {};

    history.forEach((item) => {
      const label = item.area || item.subject || "General";
      const key = label.toLowerCase();

      const percentage =
        typeof item.percentage === "number"
          ? item.percentage
          : typeof item.accuracy === "number"
          ? item.accuracy
          : item.total > 0 && typeof item.score === "number"
          ? (item.score / item.total) * 100
          : 0;

      if (!grouped[key] || percentage > grouped[key].percentage) {
        grouped[key] = {
          area: label,
          percentage: Math.round(percentage * 10) / 10,
          score500: item.score500 || calculateScore500(item.correct || item.score || 0, item.total || 0),
          score: item.correct ?? item.score ?? 0,
          total: item.total || 0,
          date: item.date,
        };
      }
    });

    return grouped;
  } catch (error) {
    console.error("❌ Error obteniendo mejores resultados:", error);
    return {};
  }
}

/* ==========================================================
   🔹 Promedio general (en porcentaje)
   ========================================================== */
export async function getAveragePerformance() {
  try {
    const history = await getQuizHistory();
    if (!history.length) return 0;

    const totalPerc = history.reduce(
      (acc, item) =>
        acc +
        (typeof item.percentage === "number"
          ? item.percentage
          : typeof item.accuracy === "number"
          ? item.accuracy
          : 0),
      0
    );

    const average = totalPerc / history.length;
    return Math.round(average);
  } catch (error) {
    console.error("❌ Error obteniendo promedio general:", error);
    return 0;
  }
}

/* ==========================================================
   🔹 Recortar historial (opcional)
   ========================================================== */
export async function trimOldResults(limit = 100) {
  try {
    const history = await getQuizHistory();
    if (history.length > limit) {
      const trimmed = history.slice(0, limit);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
      console.log(`🧾 Historial reducido a ${limit} registros.`);
    }
  } catch (error) {
    console.error("❌ Error depurando historial:", error);
  }
}
