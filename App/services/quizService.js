// App/services/QuizService.js
// ==========================================================
//  INSQUIZ - QuizService (nuevo modelo con context_text interno)
// ==========================================================

import InsquizMaster from "../data/InsQUIZ_master.json"; // Ajusta la ruta si es distinta

/**
 * Estructura esperada de cada pregunta en InsQUIZ_master.json:
 * {
 *   "id": "EN-1875",
 *   "subject": "EN", // o "LC", "MT", etc. según tu convención
 *   "context_text": "Texto de contexto aquí...",
 *   "question": "Texto de la pregunta",
 *   "options": ["A) Opción 1", "B) Opción 2", "C) Opción 3", "D) Opción 4"],
 *   "answer": "C)",  // Literal de la opción correcta
 *   "type": "single",
 *   "skill": "Descripción de la competencia/skill",
 *   "justification": "Explicación detallada de la respuesta."
 * }
 */

// Mapea tus materias a sus códigos internos si hace falta
const SUBJECT_MAP = {
  lectura: "LC",
  matematicas: "MT",
  sociales: "CS",
  naturales: "CN",
  ingles: "EN",
};

/**
 * Devuelve todas las preguntas de una materia específica.
 * @param {string} subjectKey - Puede ser "LC", "MT", "CS", "CN", "EN" o los alias del SUBJECT_MAP.
 * @param {object} options - Opciones adicionales { limit, shuffle }
 */
export function getQuestionsBySubject(subjectKey, options = {}) {
  const { limit = null, shuffle = true } = options;

  const normalized =
    SUBJECT_MAP[subjectKey?.toLowerCase?.()] || subjectKey.toUpperCase?.() || subjectKey;

  let questions = InsquizMaster.filter((q) => q.subject === normalized);

  if (shuffle) {
    questions = shuffleArray(questions);
  }

  if (limit && questions.length > limit) {
    questions = questions.slice(0, limit);
  }

  // Normalizamos campos y aseguramos context_text dentro del objeto
  return questions.map((q, index) => ({
    ...q,
    id: q.id || `${normalized}-${index + 1}`,
    context_text: q.context_text || null,
    justification: q.justification || "",
    options: Array.isArray(q.options) ? q.options : [],
  }));
}

/**
 * Devuelve un set mixto para RealSim: N preguntas por materia
 * @param {string[]} subjects - Array de materias ["LC","MT","CS","CN","EN"]
 * @param {number} perSubject - Cantidad de preguntas por materia
 */
export function getMixedQuestions(subjects, perSubject = 10) {
  let all = [];

  subjects.forEach((s) => {
    const subset = getQuestionsBySubject(s, { limit: perSubject, shuffle: true });
    all = all.concat(subset);
  });

  // Mezclamos todo el paquete
  return shuffleArray(all).map((q, index) => ({
    ...q,
    runtimeId: `${q.subject || "X"}-${index + 1}`,
  }));
}

// Utilidad para barajar arrays
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
