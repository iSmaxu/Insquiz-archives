// App/services/quizService.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import master from "../data/InsQUIZ_master_reindexed.json";
import textosLectura from "../data/textos/textos_lectura.json";
import textosMatematicas from "../data/textos/textos_matematicas.json";
import textosSociales from "../data/textos/textos_ciencias_sociales.json";
import textosNaturales from "../data/textos/textos_ciencias_naturales.json";
import textosIngles from "../data/textos/textos_ingles.json";

const CACHE_KEY = "questions_cached_v2";

function normalizeKey(s = "") {
  return s.toString().toLowerCase().trim();
}

function buildContextMap() {
  // Map context title -> context_text for all datasets
  const map = new Map();
  const datasets = [textosLectura, textosMatematicas, textosSociales, textosNaturales, textosIngles];
  for (const ds of datasets) {
    if (!Array.isArray(ds)) continue;
    for (const t of ds) {
      const key = normalizeKey(t.context_title || t.title || "");
      if (key) map.set(key, t.context_text || t.text || "");
    }
  }
  return map;
}

function normalizeQuestion(raw) {
  if (!raw) return null;
  const id = raw.id || raw.ID || "";
  const pregunta = raw.question || raw.pregunta || "";
  const options = raw.options || raw.respuestas || [];
  const answer = raw.answer || raw.correcta || "";
  const context = raw.context || raw.contexto || "";
  return { id, pregunta, options, answer, context, raw };
}

export async function loadQuestionsCache(onProgress = () => {}) {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) return JSON.parse(cached);

    const contextMap = buildContextMap();

    const subjects = Object.keys(master);
    const result = {};
    let total = 0;

    for (const subject of subjects) {
      const list = master[subject] || [];
      const normalized = list.map(normalizeQuestion).filter(Boolean);
      const withContext = normalized.map((q) => {
        const key = normalizeKey(q.context);
        const context_text = contextMap.get(key) || "";
        return { ...q, context_text };
      }).filter(q => q.context_text && q.pregunta);

      result[subject] = withContext;
      total += withContext.length;
      onProgress({ subject, count: withContext.length, total });
    }

    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(result));
    return result;
  } catch (e) {
    console.error("Error loading questions cache:", e);
    return {};
  }
}

export async function clearQuestionsCache() {
  await AsyncStorage.removeItem(CACHE_KEY);
}

export function prepareQuizFromSubject(subjectArray, count = 10) {
  if (!Array.isArray(subjectArray)) return [];
  const shuffled = subjectArray.sort(() => Math.random() - 0.5).slice(0, count);
  return shuffled.map((q) => ({ ...q, selected: null }));
}

export function answerMatchesMaster(answerLetter, masterAnswer) {
  // masterAnswer like "C)" or "C) texto"; normalize to letter
  const got = (answerLetter || "").toString().toLowerCase().replace(/[^a-z]/g, "");
  const correct = (masterAnswer || "").toString().toLowerCase().replace(/[^a-z]/g, "");
  return got === correct;
}

