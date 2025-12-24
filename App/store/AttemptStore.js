// App/store/AttemptStore.js
// ==========================================================
// INSQUIZ — Attempt Store (persistente)
// Guarda y recupera el último intento para ReviewScreen
// ==========================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_LAST_ATTEMPT = "@INSQUIZ_LAST_ATTEMPT";

export async function saveAttempt(attempt) {
  try {
    await AsyncStorage.setItem(
      KEY_LAST_ATTEMPT,
      JSON.stringify(attempt)
    );
  } catch (e) {
    console.log("❌ Error guardando attempt:", e);
  }
}

export async function loadLastAttempt() {
  try {
    const raw = await AsyncStorage.getItem(KEY_LAST_ATTEMPT);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.log("❌ Error cargando attempt:", e);
    return null;
  }
}

export async function clearLastAttempt() {
  try {
    await AsyncStorage.removeItem(KEY_LAST_ATTEMPT);
  } catch {}
}
