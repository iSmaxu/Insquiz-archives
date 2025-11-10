// App/services/quizService.js
// ==========================================================
// INSQUIZ - Quiz Service (versión 2025 con context textual)
// ==========================================================
// Usa los campos del JSON reindexado, filtra por prefijo (LQ-, CN-, MT-, etc.)
// y devuelve las preguntas con context = string literal.
// ==========================================================
import { shuffleArray } from "./utilsService";

let cachedQuestions = [];

const SUBJECT_PREFIX = {
  lectura: "LQ-",
  matematicas: "MT-",
  sociales: "CS-",
  ciencias_naturales: "CN-",
  ingles: "IN-",
};

// ==========================================================
// 🚀 Precarga del banco completo
// ==========================================================
export async function preloadQuestions() {
  try {
    if (cachedQuestions.length > 0) return;
    console.log("⏳ Precargando banco maestro...");
    const data = require("../data/InsQUIZ_master_reindexed.json");

    if (Array.isArray(data)) {
      cachedQuestions = data;
    } else {
      cachedQuestions = Object.values(data).flat();
    }

    console.log(`✅ Preguntas cargadas: ${cachedQuestions.length}`);
  } catch (error) {
    console.error("❌ Error cargando preguntas:", error);
    cachedQuestions = [];
  }
}

// ==========================================================
// 🎯 Filtrar preguntas por materia según prefijo
// ==========================================================
export async function getQuestionsBySubject(subjectKey) {
  if (!cachedQuestions.length) await preloadQuestions();

  const prefix =
    SUBJECT_PREFIX[subjectKey?.toLowerCase()] ||
    subjectKey?.toUpperCase()?.substring(0, 2) + "-";

  const filtered = cachedQuestions.filter((q) =>
    q.id?.startsWith(prefix)
  );

  if (!filtered.length) {
    console.warn(`⚠️ No se encontraron preguntas para: ${subjectKey}`);
    return [];
  }

  const shuffled = shuffleArray(filtered);
  console.log(`📘 ${filtered.length} preguntas encontradas para ${subjectKey}`);
  return shuffled;
}

// ==========================================================
// 🧩 Crear quiz con N preguntas aleatorias
// ==========================================================
export async function prepareQuizFromSubject(subjectKey, limit = 10) {
  const data = await getQuestionsBySubject(subjectKey);
  return data.slice(0, limit);
}

// ==========================================================
// 🔄 Obtener una pregunta aleatoria por prefijo
// ==========================================================
export async function getRandomQuestionByPrefix(prefix = "LQ-") {
  if (!cachedQuestions.length) await preloadQuestions();
  const filtered = cachedQuestions.filter((q) =>
    q.id?.startsWith(prefix)
  );
  if (!filtered.length) return null;
  const random = filtered[Math.floor(Math.random() * filtered.length)];
  return random;
}
