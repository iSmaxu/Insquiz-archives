// App/engines/HistoryEngine.js
// ==========================================================
// INSQUIZ - HistoryEngine v1
// ✅ Guarda IDs recientes (cap 600)
// ✅ Anti-repetición real
// ==========================================================
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@insquiz_history_v1";
const CAP = 600;

export async function getHistory() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export async function saveHistory(id) {
  try {
    if (!id) return;

    const curr = await getHistory();

    // Evitar duplicado al inicio
    const filtered = curr.filter((x) => x !== id);
    const next = [id, ...filtered].slice(0, CAP);

    await AsyncStorage.setItem(KEY, JSON.stringify(next));
  } catch (e) {
    console.log("❌ Error saveHistory:", e);
  }
}

export async function clearHistory() {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (e) {
    console.log("❌ Error clearHistory:", e);
  }
}
