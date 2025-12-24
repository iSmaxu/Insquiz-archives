// ==========================================================
// INSQUIZ — RealSimStateStore
// Estado + tiempo + marcado con bloqueo
// ==========================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import blueprint from "./realsimBlueprint";

const STORAGE_KEY = "INSQUIZ_REALSIM_STATE_V2";

function now() {
  return Date.now();
}

export async function loadRealSimState() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const s = JSON.parse(raw);

    return {
      ...s,
      answers: s.answers || {},
      marked: Array.isArray(s.marked) ? s.marked : [],
      timing: s.timing || {},
      progress: s.progress || { session: "session1", questionIndex: 0 },
      completed: !!s.completed,
      meta: s.meta || {},
    };
  } catch {
    return null;
  }
}

export async function saveRealSimState(state) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export async function clearRealSimState() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export function createInitialState(examPack) {
  const start = now();
  const s1Limit = blueprint.sessions.session1.timeLimitMs;

  return {
    meta: {
      examId: examPack.meta.examId,
      seed: examPack.meta.seed,
      startedAt: start,
      totalQuestions: examPack.meta.totalQuestions,
    },
    answers: {},
    marked: [],
    completed: false,
    progress: { session: "session1", questionIndex: 0 },
    timing: {
      session1: {
        startedAt: start,
        endsAt: start + s1Limit,
      },
      session2: {
        startedAt: null,
        endsAt: null,
      },
    },
  };
}

// ---------------------
// RESPUESTAS + MARCADO
// ---------------------

export function recordAnswer(state, questionId, letter) {
  // 🔒 si está marcado, NO se permite cambiar
  if (Array.isArray(state.marked) && state.marked.includes(questionId)) {
    return state;
  }

  return {
    ...state,
    answers: { ...state.answers, [questionId]: letter },
  };
}

export function toggleMark(state, questionId) {
  const marked = [...(state.marked || [])];
  const idx = marked.indexOf(questionId);

  if (idx >= 0) {
    // desmarcar → ahora se puede modificar
    marked.splice(idx, 1);
  } else {
    // marcar → congela respuesta actual
    marked.push(questionId);
  }

  return { ...state, marked };
}

// ---------------------
// NAVEGACIÓN + TIEMPO
// ---------------------

export function nextQuestion(state, examPack) {
  const { session, questionIndex } = state.progress;
  const questions = examPack.sessions[session];

  if (questionIndex + 1 < questions.length) {
    return { ...state, progress: { session, questionIndex: questionIndex + 1 } };
  }

  if (session === "session1") {
    const start = now();
    const limit = blueprint.sessions.session2.timeLimitMs;

    return {
      ...state,
      progress: { session: "session2", questionIndex: 0 },
      timing: {
        ...state.timing,
        session2: {
          startedAt: start,
          endsAt: start + limit,
        },
      },
    };
  }

  return { ...state, completed: true };
}

export function previousQuestion(state) {
  const { session, questionIndex } = state.progress;

  if (questionIndex > 0) {
    return { ...state, progress: { session, questionIndex: questionIndex - 1 } };
  }

  if (session === "session2") {
    return { ...state, progress: { session: "session1", questionIndex: 0 } };
  }

  return state;
}

// ---------------------
// TIEMPO
// ---------------------

export function isTimeExpired(state) {
  const s = state.progress.session;
  const t = state.timing?.[s];
  if (!t?.endsAt) return false;
  return now() >= t.endsAt;
}

export function remainingTimeMs(state) {
  const s = state.progress.session;
  const t = state.timing?.[s];
  if (!t?.endsAt) return null;
  return Math.max(0, t.endsAt - now());
}
