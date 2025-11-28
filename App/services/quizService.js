// App/services/quizService.js
// ==========================================================
//  INSQUIZ - QuizService (versión estable con mezcla y
//  justificaciones sin letras A/B/C/D)
// ==========================================================

import raw from "../data/InsQUIZ_master.json";

// ----------------------------------------------------------
// Mapeo área → código
// ----------------------------------------------------------
const AREA_TO_CODE = {
  lectura: "LQ",
  matematicas: "MT",
  ciencias_naturales: "CN",
  ciencias_sociales: "CS",
  ingles: "EN",
};

// Alias para llamadas externas
const SUBJECT_ALIAS = {
  lectura: "lectura",
  lq: "lectura",
  lc: "lectura",

  matematicas: "matematicas",
  mt: "matematicas",

  ciencias_naturales: "ciencias_naturales",
  cn: "ciencias_naturales",

  ciencias_sociales: "ciencias_sociales",
  cs: "ciencias_sociales",

  ingles: "ingles",
  en: "ingles",
};

// ----------------------------------------------------------
// Utilidades de opciones
// ----------------------------------------------------------
function extractLetter(opt) {
  if (!opt) return "";
  const m = opt.match(/^[A-D]\)/i);
  return m ? m[0].replace(")", "").trim().toUpperCase() : "";
}

function cleanOptionText(opt) {
  if (!opt) return "";
  return opt.replace(/^[A-D]\)\s*/i, "").trim();
}

// Limpia referencias a A/B/C/D en la justificación
function sanitizeJustification(just) {
  if (!just) return "";

  let txt = just;

  // "la opción A)" -> "la opción correcta"
  txt = txt.replace(/la opción [A-D]\)/gi, "la opción correcta");
  txt = txt.replace(/la opción\s+[A-D]\b/gi, "la opción correcta");

  // "La A)" / "la B)" -> "esa opción"
  txt = txt.replace(/la [A-D]\)/gi, "esa opción");
  txt = txt.replace(/la\s+[A-D]\b/gi, "esa opción");

  return txt;
}

// Mezcla opciones y devuelve textos limpios + respuesta correcta
function processOptions(options, correctLetter, justification) {
  let list = (options || []).map((opt) => ({
    original: opt,
    letter: extractLetter(opt),
    clean: cleanOptionText(opt),
  }));

  // Mezclar orden de las opciones
  list = shuffleArray(list);

  // Encontrar la opción correcta por la letra original
  const correctObj = list.find((o) => o.letter === correctLetter);

  return {
    newOptions: list.map((o) => o.clean),
    correctText: correctObj ? correctObj.clean : "",
    newJustification: sanitizeJustification(justification),
  };
}

// ----------------------------------------------------------
// Normalizar dificultad
// ----------------------------------------------------------
function normalizeDifficulty(d) {
  const v = (d || "").toLowerCase();
  if (v.includes("baja")) return "easy";
  if (v.includes("media")) return "medium";
  if (v.includes("alta")) return "hard";
  return "medium";
}

// ----------------------------------------------------------
// Construir MASTER_QUESTIONS plano y limpio
// ----------------------------------------------------------
const MASTER_QUESTIONS = (() => {
  const master = [];

  if (!raw || typeof raw !== "object") return master;

  Object.entries(raw).forEach(([area, items]) => {
    if (!Array.isArray(items)) return;

    const code = AREA_TO_CODE[area] || area.toUpperCase().slice(0, 2);

    items.forEach((q, idx) => {
      const id = q.id || `${code}-${String(idx + 1).padStart(4, "0")}`;

      const correctLetter = extractLetter(q.answer);
      const processed = processOptions(q.options, correctLetter, q.justification);

      master.push({
        id,
        area,
        subject: code,

        context_text: q.context_text || "",
        question: q.question || "",

        // Opciones limpias, sin "A) "
        options: processed.newOptions,

        // Respuesta correcta = TEXTO limpio
        answer: processed.correctText,

        // Justificación sin letras A/B/C/D
        justification: processed.newJustification,

        skill: q.skill || "",
        difficulty_label: q.difficulty || "",
        difficulty: normalizeDifficulty(q.difficulty),
        type: q.type || "single",
        extended: q.extended || null,
      });
    });
  });

  return master;
})();

// ----------------------------------------------------------
// Resolver área / código
// ----------------------------------------------------------
function resolveAreaAndCode(key) {
  if (!key) return { area: null, code: null };
  const lower = key.toLowerCase();

  if (SUBJECT_ALIAS[lower]) {
    const area = SUBJECT_ALIAS[lower];
    return { area, code: AREA_TO_CODE[area] };
  }

  const upper = key.toUpperCase();
  const found = Object.entries(AREA_TO_CODE).find(([, c]) => c === upper);
  if (found) return { area: found[0], code: upper };

  return { area: null, code: null };
}

// ----------------------------------------------------------
// Obtener preguntas por materia
// ----------------------------------------------------------
export function getQuestionsBySubject(subjectKey, { limit = null, shuffle = true } = {}) {
  if (subjectKey === "all") {
    let arr = [...MASTER_QUESTIONS];
    if (shuffle) arr = shuffleArray(arr);
    if (limit) arr = arr.slice(0, limit);
    return arr;
  }

  const { code } = resolveAreaAndCode(subjectKey);
  if (!code) return [];

  let arr = MASTER_QUESTIONS.filter((q) => q.subject === code);
  if (shuffle) arr = shuffleArray(arr);
  if (limit) arr = arr.slice(0, limit);

  return arr;
}

// ----------------------------------------------------------
// Mezclar materias (RealSim / mixto)
// ----------------------------------------------------------
export function getMixedQuestions(subjects, perSubject = 10) {
  let all = [];

  subjects.forEach((s) => {
    const { code } = resolveAreaAndCode(s);
    if (!code) return;

    const pool = MASTER_QUESTIONS.filter((q) => q.subject === code);
    all = all.concat(shuffleArray(pool).slice(0, perSubject));
  });

  return shuffleArray(all);
}

// ----------------------------------------------------------
// Compatibilidad
// ----------------------------------------------------------
export function prepareQuizFromSubject(key, limit = 10) {
  return getQuestionsBySubject(key, { limit, shuffle: true });
}

export function getCombinedPool(perSubject = 10) {
  return getMixedQuestions(["LQ", "MT", "CN", "CS", "EN"], perSubject);
}

// ----------------------------------------------------------
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export { MASTER_QUESTIONS as InsquizMaster };
