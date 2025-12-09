// ==========================================================
// INSQUIZ - Question Service unificado (2025)
// Conecta TODOS los modos y soluciona "No se recibieron preguntas"
// ==========================================================

import master from "../data/insquiz_master"; // ← tu archivo REAL
import AsyncStorage from "@react-native-async-storage/async-storage";

// ==========================================================
// Normalización segura
// ==========================================================
function normalizeSubject(s) {
  s = (s || "").toLowerCase().trim();

  if (s.includes("lect")) return "lectura_critica";
  if (s.includes("mate")) return "matematicas";
  if (s.includes("natur")) return "ciencias_naturales";
  if (s.includes("socia")) return "ciencias_sociales";
  if (s.includes("ingl")) return "ingles";

  return s;
}

// ==========================================================
// 🔥 FUNCIÓN UNIVERSAL → TODOS LOS MODOS USAN ESTA
// ==========================================================
export function getQuestions(subject, count = 20) {
  const key = normalizeSubject(subject);

  const qs = master.filter(
    (q) => normalizeSubject(q.subject) === key
  );

  if (!qs.length) {
    console.log("❌ No se encontraron preguntas para:", subject);
    return [];
  }

  return shuffleArray(qs).slice(0, count);
}

// ==========================================================
// Para modos por área (Práctica por materia)
// ==========================================================
export async function getQuestionsByArea(area, count = 80) {
  const key = normalizeSubject(area);
  const qs = master.filter(
    (q) => normalizeSubject(q.subject) === key
  );

  if (!qs.length) {
    console.log("❌ No hay preguntas en área:", area);
    return [];
  }

  const seleccionadas = shuffleArray(qs).slice(0, count);

  await AsyncStorage.setItem(`questions_${key}`, JSON.stringify(seleccionadas));

  return seleccionadas;
}

// ==========================================================
export async function getQuestionsLocal(area) {
  try {
    const json = await AsyncStorage.getItem(
      `questions_${normalizeSubject(area)}`
    );
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

// ==========================================================
// Utilidad
// ==========================================================
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
