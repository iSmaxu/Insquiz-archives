// App/store/AttemptStore.js
// ==========================================================
// INSQUIZ - AttemptStore FINAL
// ✅ Compatible con QuizScreen v5.2 (saveAttempt)
// ✅ Compatible con ReviewScreen (getAttemptById)
// ==========================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@insquiz_attempts_final";
const CAP = 80;

async function readMap() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const map = raw ? JSON.parse(raw) : {};
    return map && typeof map === "object" && !Array.isArray(map) ? map : {};
  } catch {
    return {};
  }
}

async function writeMap(map) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(map));
  } catch (e) {
    console.log("❌ AttemptStore write error:", e);
  }
}

function capMap(map) {
  const ordered = Object.values(map)
    .filter(Boolean)
    .sort((a, b) => (b?.createdAt || 0) - (a?.createdAt || 0))
    .slice(0, CAP);

  const next = {};
  for (const a of ordered) {
    if (a?.id) next[a.id] = a;
  }
  return next;
}

export async function saveAttempt(attempt) {
  try {
    if (!attempt?.id) return;

    const map = await readMap();
    map[attempt.id] = attempt;

    await writeMap(capMap(map));
  } catch (e) {
    console.log("❌ Error saveAttempt:", e);
  }
}

export async function getAttemptById(id) {
  try {
    if (!id) return null;
    const map = await readMap();
    return map[id] || null;
  } catch {
    return null;
  }
}

export async function getAttempts() {
  const map = await readMap();
  return Object.values(map).sort(
    (a, b) => (b?.createdAt || 0) - (a?.createdAt || 0)
  );
}

export async function clearAttempts() {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (e) {
    console.log("❌ Error clearAttempts:", e);
  }
}
