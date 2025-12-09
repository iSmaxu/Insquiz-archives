// App/engines/HistoryEngine.js
// ==========================================================
// INSQUIZ — Historial de ID de preguntas respondidas
// Evita repetir las últimas 600 preguntas realizadas
// ==========================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

const HISTORY_KEY = "insquiz_history_ids";
const LIMIT = 600; // Máximo de IDs guardadas

// Guarda una pregunta respondida
export async function saveHistory(id) {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    let arr = raw ? JSON.parse(raw) : [];

    // Insertar al inicio
    arr.unshift(id);

    // Limitar a 600
    if (arr.length > LIMIT) arr = arr.slice(0, LIMIT);

    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(arr));
  } catch (err) {
    console.log("[HistoryEngine] Error al guardar historial:", err);
  }
}

// Devuelve array de IDs
export async function getHistory() {
  try {
    const raw = await AsyncStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
