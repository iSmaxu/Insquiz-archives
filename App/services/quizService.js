// App/services/quizService.js
// ==========================================================
// INSQUIZ - QUIZ ENGINE v5
// ahora con prevención de repetición (últimas 600)
// y fragmentación por materia en modos específicos
// ==========================================================

import { getHistory } from "../engines/HistoryEngine";

// Bancos fragmentados (ya vienen en formato master-like)
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
    "ingles": "ingles",
  };

  if (map[s]) return map[s];

  // fallback: por si acaso ya viene bien
  if (BANKS[s]) return s;

  return s;
}

// ==========================================================
//  Utilidades
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
        return { letter: match[1].toUpperCase(), text: match[2].trim() };
      }
      return { letter: String.fromCharCode(65 + i), text: op };
    }
    if (op?.letter && op?.text) {
      return { letter: op.letter.toUpperCase(), text: op.text.trim() };
    }
    return { letter: String.fromCharCode(65 + i), text: String(op) };
  });
}

function normalizeLetter(x) {
  if (!x) return "A";
  const L = x.toString().trim().toUpperCase();
  return ["A", "B", "C", "D"].includes(L) ? L : "A";
}

function normalizeQuestion(q, subjectOverride) {
  const subjectFinal = subjectOverride || normSubject(q.subject);
  const options = normalizeOptions(q.options);
  const correct = normalizeLetter(q.correct_letter || q.answer);

  return {
    id: q.id,
    subject: subjectFinal,
    context_text: q.context_text || q.context || "",
    question: q.question || "",
    options,
    answer: correct,
    correct_letter: correct,
    justification: q.justification || "",
    skill: q.skill || "",
    difficulty: q.difficulty || "",
  };
}

// ============================================
//  FILTRO ANTI-REPETICIÓN (últimas ~600)
// ============================================
async function filterHistory(bank) {
  try {
    const history = await getHistory(); // IDs recientes
    if (!history || !history.length) return bank;
    return bank.filter((q) => !history.includes(q.id));
  } catch {
    return bank;
  }
}

// =====================================
//  MODOS
// =====================================

// Modo clásico: una sola materia
async function buildClassic(subject, limit) {
  const S = normSubject(subject);

  if (S === "all") return buildFull(limit);

  let bank = BANKS[S] || [];
  bank = await filterHistory(bank);

  return shuffle(bank)
    .slice(0, limit)
    .map((q) => normalizeQuestion(q, S));
}

// Modo full: mix equilibrado de todas las materias
async function buildFull(limit) {
  // Mezcla de TODOS los bancos
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
    .map((q) => normalizeQuestion(q));
}

// Modo azar: reparte el límite proporcional según tamaño de cada banco
async function buildAzar(limit) {
  const totals = Object.values(BANKS).reduce((acc, b) => acc + b.length, 0);
  let result = [];

  for (const key of Object.keys(BANKS)) {
    const bank = BANKS[key];
    const proportion = bank.length / totals;
    const amount = Math.max(1, Math.round(limit * proportion));

    let filtered = await filterHistory(bank);

    result.push(
      ...shuffle(filtered)
        .slice(0, amount)
        .map((q) => normalizeQuestion(q, key))
    );
  }

  return shuffle(result).slice(0, limit);
}

// Modo RealSim: simulacro 390 fragmentado por materia
function buildRealSim() {
  const distribution = {
    lectura_critica: 41,
    matematicas: 50,
    ciencias_sociales: 50,
    ciencias_naturales: 58,
    ingles: 55,
  };

  let result = [];

  Object.keys(distribution).forEach((key) => {
    const count = distribution[key];
    const bank = BANKS[key] || [];

    result.push(
      ...shuffle(bank)
        .slice(0, count)
        .map((q) => normalizeQuestion(q, key))
    );
  });

  return shuffle(result);
}

// =====================================
//  API PÚBLICA
// =====================================
export async function getQuizByMode(mode, subject, limit = 10) {
  const m = (mode || "").toLowerCase();

  switch (m) {
    case "classic":
      return await buildClassic(subject, limit);
    case "custom":
      // Custom utiliza classic con límites personalizados
      return await buildClassic(subject, limit);
    case "full":
      return await buildFull(limit);
    case "azar":
      return await buildAzar(limit);
    case "realsim":
      return buildRealSim();
    default:
      return await buildClassic(subject, limit);
  }
}

// Compatibilidad antigua
export async function getQuestions(subject, count = 10) {
  return getQuizByMode("classic", subject, count);
}

// Exponer RealSim para pantallas específicas
export function generateRealSim() {
  return buildRealSim();
}
