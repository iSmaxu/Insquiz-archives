// App/services/quizService.js
// ==========================================================
// INSQUIZ - QUIZ ENGINE v5.1
// ✅ Prevención repetición (últimas 600)
// ✅ Fragmentación por materia
// ✅ Modos: classic/custom/full/azar/realsim
// ✅ Normalización robusta de preguntas
// ✅ Acceso determinista por ID (debug / testing)
// ==========================================================

import { getHistory } from "../engines/HistoryEngine";

// Bancos fragmentados
import CN from "../data/converted_questions/cn";
import CS from "../data/converted_questions/cs";
import EN from "../data/converted_questions/en";
import LQ from "../data/converted_questions/lq";
import MT from "../data/converted_questions/mt";

// ==========================================================
//  Mapa de bancos por materia
// ==========================================================
const BANKS = {
  lectura_critica: LQ,
  matematicas: MT,
  ciencias_naturales: CN,
  ciencias_sociales: CS,
  ingles: EN,
};

// ==========================================================
//  Normalización de subject súper robusta
// ==========================================================
function normSubject(s) {
  if (!s) return "";

  s = s.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  s = s.toLowerCase().trim();

  if (s === "all" || s === "todos" || s === "mixto") return "all";

  const map = {
    // Lectura
    lq: "lectura_critica",
    lectura: "lectura_critica",
    "lectura critica": "lectura_critica",
    lectura_critica: "lectura_critica",

    // Matemáticas
    mt: "matematicas",
    mate: "matematicas",
    matematicas: "matematicas",

    // Ciencias Naturales
    cn: "ciencias_naturales",
    naturales: "ciencias_naturales",
    "ciencias naturales": "ciencias_naturales",
    ciencias_naturales: "ciencias_naturales",

    // Ciencias Sociales
    cs: "ciencias_sociales",
    sociales: "ciencias_sociales",
    "ciencias sociales": "ciencias_sociales",
    ciencias_sociales: "ciencias_sociales",

    // Inglés
    en: "ingles",
    ing: "ingles",
    ingles: "ingles",
  };

  if (map[s]) return map[s];
  if (BANKS[s]) return s;

  return s;
}

// ==========================================================
// Utilidades
// ==========================================================
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalizeOptions(options = []) {
  return options.map((op, i) => {
    if (typeof op === "string") {
      const match = op.match(/^([A-D])\)\s*(.*)$/i);
      if (match) {
        return {
          letter: match[1].toUpperCase(),
          text: match[2].trim(),
        };
      }
      return {
        letter: String.fromCharCode(65 + i),
        text: op,
      };
    }

    if (op?.letter && op?.text) {
      return {
        letter: op.letter.toUpperCase(),
        text: op.text.trim(),
      };
    }

    return {
      letter: String.fromCharCode(65 + i),
      text: String(op),
    };
  });
}

function normalizeLetter(x) {
  if (!x) return "A";
  const L = x.toString().trim().toUpperCase();
  return ["A", "B", "C", "D"].includes(L) ? L : "A";
}

function normalizeQuestion(q, subjectOverride) {
  const subjectFinal = subjectOverride || normSubject(q.subject);
  const options = normalizeOptions(q.options || []);
  const correct = normalizeLetter(q.correct_letter || q.answer);

  

  return {
    id: q.id,
    subject: subjectFinal,

    // 🔹 CONTENIDO
    context_text: q.context_text || q.context || "",
    question: q.question || "",

    // 🔹 OPCIONES CLÁSICAS
    options,
    answer: correct,
    correct_letter: correct,

    // 🔹 🔥 PRESERVAR TIPO Y ITEMS
    type: q.type || "single",
    items: Array.isArray(q.items) ? q.items : null,

    // 🔹 META
    justification: q.justification || "",
    skill: q.skill || "",
    difficulty: q.difficulty || "",
  };
}

// ==========================================================
//  FILTRO ANTI-REPETICIÓN (últimas ~600)
// ==========================================================
async function filterHistory(bank) {
  try {
    const history = await getHistory();
    if (!history || !history.length) return bank;
    const set = new Set(history);
    return bank.filter(q => !set.has(q.id));
  } catch {
    return bank;
  }
}

// ==========================================================
//  MODOS
// ==========================================================
async function buildClassic(subject, limit) {
  const S = normSubject(subject);

  if (S === "all") return buildFull(limit);

  let bank = BANKS[S] || [];
  bank = await filterHistory(bank);

  return shuffle(bank)
    .slice(0, limit)
    .map(q => normalizeQuestion(q, S));
}

async function buildFull(limit) {
  let all = [
    ...BANKS.lectura_critica,
    ...BANKS.matematicas,
    ...BANKS.ciencias_naturales,
    ...BANKS.ciencias_sociales,
    ...BANKS.ingles,
  ];

  all = await filterHistory(all);

  return shuffle(all)
    .slice(0, limit)
    .map(q => normalizeQuestion(q));
}

async function buildAzar(limit) {
  const totals = Object.values(BANKS).reduce((a, b) => a + b.length, 0);
  let result = [];

  for (const key of Object.keys(BANKS)) {
    const bank = BANKS[key] || [];
    const proportion = totals ? bank.length / totals : 0.2;
    const amount = Math.max(1, Math.round(limit * proportion));

    let filtered = await filterHistory(bank);

    result.push(
      ...shuffle(filtered)
        .slice(0, amount)
        .map(q => normalizeQuestion(q, key))
    );
  }

  return shuffle(result).slice(0, limit);
}

async function buildRealSim() {
  const distribution = {
    lectura_critica: 41,
    matematicas: 50,
    ciencias_sociales: 50,
    ciencias_naturales: 58,
    ingles: 55,
  };

  let result = [];

  for (const key of Object.keys(distribution)) {
    const count = distribution[key];
    let bank = BANKS[key] || [];

    bank = await filterHistory(bank);
    if (bank.length < count) bank = BANKS[key] || [];

    result.push(
      ...shuffle(bank)
        .slice(0, count)
        .map(q => normalizeQuestion(q, key))
    );
  }

  return shuffle(result);
}

// ==========================================================
//  API PÚBLICA
// ==========================================================
export async function getQuizByMode(mode, subject, limit = 10) {
  const m = (mode || "").toLowerCase();

  switch (m) {
    case "classic":
    case "custom":
      return await buildClassic(subject, limit);
    case "full":
      return await buildFull(limit);
    case "azar":
      return await buildAzar(limit);
    case "realsim":
      return await buildRealSim();
    default:
      return await buildClassic(subject, limit);
  }
}

export async function getQuestions(subject, count = 10) {
  return getQuizByMode("classic", subject, count);
}

export async function generateRealSim() {
  return await buildRealSim();
}

// ==========================================================
//  DEBUG / TESTING — obtener pregunta por ID
// ==========================================================
export async function getQuestionById(id) {
  if (!id) return null;

  const all = [
    ...BANKS.lectura_critica,
    ...BANKS.matematicas,
    ...BANKS.ciencias_naturales,
    ...BANKS.ciencias_sociales,
    ...BANKS.ingles,
  ];

  const found = all.find(q => q.id === id);
  if (!found) return null;

  return normalizeQuestion(found);
}
