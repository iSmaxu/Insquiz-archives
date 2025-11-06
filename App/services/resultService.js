// App/services/resultService.js
// ==========================================================
// INSQUIZ - Servicio de Resultados e Historial Local
// ==========================================================
// Maneja el almacenamiento local de resultados de prácticas y simulacros,
// permite consultar el historial completo, el mejor resultado por materia
// y el promedio general del usuario.
// ==========================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

/* ==========================================================
   🔹 Guardar un nuevo resultado
   ========================================================== */
export async function saveQuizResult(result) {
  try {
    const existing = await AsyncStorage.getItem("quizHistory");
    const history = existing ? JSON.parse(existing) : [];

    const newEntry = {
      ...result,
      date: result.date || new Date().toISOString(),
    };

    const updated = [newEntry, ...history];
    await AsyncStorage.setItem("quizHistory", JSON.stringify(updated));
    console.log("✅ Resultado guardado:", newEntry);
  } catch (error) {
    console.error("❌ Error guardando resultado:", error);
  }
}

/* ==========================================================
   🔹 Obtener historial completo
   ========================================================== */
export async function getQuizHistory() {
  try {
    const data = await AsyncStorage.getItem("quizHistory");
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
    await AsyncStorage.removeItem("quizHistory");
    console.log("🧹 Historial de resultados eliminado.");
  } catch (error) {
    console.error("❌ Error limpiando historial:", error);
  }
}

/* ==========================================================
   🔹 Obtener el mejor resultado por materia
   ========================================================== */
export async function getBestResultsBySubject() {
  try {
    const history = await getQuizHistory();
    if (!history.length) return {};

    const grouped = {};
    history.forEach((item) => {
      const key = item.area.toLowerCase();
      if (!grouped[key] || item.percentage > grouped[key].percentage) {
        grouped[key] = {
          area: item.area,
          percentage: item.percentage,
          score: item.score,
          total: item.total,
          date: item.date,
        };
      }
    });

    return grouped; // ejemplo: { "lectura crítica": { area: "...", percentage: 92, ... } }
  } catch (error) {
    console.error("❌ Error obteniendo mejores resultados:", error);
    return {};
  }
}

/* ==========================================================
   🔹 Obtener promedio general
   ========================================================== */
export async function getAveragePerformance() {
  try {
    const history = await getQuizHistory();
    if (!history.length) return 0;

    const total = history.reduce((acc, item) => acc + (item.percentage || 0), 0);
    const average = total / history.length;
    return Math.round(average);
  } catch (error) {
    console.error("❌ Error obteniendo promedio general:", error);
    return 0;
  }
}

/* ==========================================================
   🔹 Eliminar entradas antiguas (opcional)
   ========================================================== */
export async function trimOldResults(limit = 100) {
  try {
    const history = await getQuizHistory();
    if (history.length > limit) {
      const trimmed = history.slice(0, limit);
      await AsyncStorage.setItem("quizHistory", JSON.stringify(trimmed));
      console.log(`🧾 Historial reducido a ${limit} registros.`);
    }
  } catch (error) {
    console.error("❌ Error depurando historial:", error);
  }
}
