// ==========================================================
// INSQUIZ — RealSimHistory
// - control de cooldown diario
// - registro de intentos
// ==========================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "INSQUIZ_REALSIM_HISTORY_V1";

function startOfTodayLocal() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function startOfTomorrowLocal() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1);
  return d.getTime();
}

export function formatTomorrowHuman() {
  const t = new Date(startOfTomorrowLocal());
  // "mañana" se maneja en UX; aquí dejamos fecha legible:
  return t.toLocaleDateString();
}

export async function getHistory() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export async function pushAttempt(attempt) {
  const history = await getHistory();
  const next = [attempt, ...history].slice(0, 30); // últimos 30 intentos
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
}

export async function canStartRealSimToday() {
  const history = await getHistory();
  const today0 = startOfTodayLocal();

  // si hay un intento completado al 100% hoy → bloqueado
  const completedToday = history.find(
    (a) => a?.completed === true && (a?.endedAt || 0) >= today0
  );

  return !completedToday;
}

export function computeProgressPct(state, examPack) {
  const total = (examPack?.meta?.totalQuestions || state?.meta?.totalQuestions || 254);
  const answered = state?.answers ? Object.keys(state.answers).length : 0;
  const pct = total > 0 ? (answered / total) * 100 : 0;
  return { answered, total, pct };
}

export async function finalizeAttempt({ state, examPack, endedReason }) {
  const { answered, total, pct } = computeProgressPct(state, examPack);

  const attempt = {
    id: `att_${Date.now()}`,
    startedAt: state?.meta?.startedAt || Date.now(),
    endedAt: Date.now(),
    endedReason: endedReason || "unknown",
    answered,
    total,
    pct: Math.round(pct * 10) / 10,
    completed: pct >= 99.99, // 100% realista
  };

  await pushAttempt(attempt);

  // cooldown solo si completó 100%
  return attempt;
}

export function isRepeatAllowed(attempt) {
  // Si no completó y está por debajo de 70% → puede repetir
  if (!attempt) return true;
  if (attempt.completed) return false;
  return attempt.pct < 70;
}

export function tomorrowTimestamp() {
  return startOfTomorrowLocal();
}
