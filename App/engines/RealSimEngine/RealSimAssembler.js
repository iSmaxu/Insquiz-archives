// ==========================================================
// INSQUIZ — RealSimAssembler (FORZADO, sin dificultad)
// - arma sessions.session1/session2 SIEMPRE
// - si falta banco, rellena permitiendo repetición
// - normaliza q.context.text + q.context.visual
// - normaliza q.options a {A,B,C,D}
// ==========================================================

import blueprint from "./realsimBlueprint";

function normSubject(s) {
  if (!s) return "";
  s = s.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  s = s.toLowerCase().trim();

  const map = {
    lq: "lectura_critica",
    lectura: "lectura_critica",
    "lectura critica": "lectura_critica",
    lectura_critica: "lectura_critica",

    mt: "matematicas",
    mate: "matematicas",
    matematicas: "matematicas",

    cn: "ciencias_naturales",
    naturales: "ciencias_naturales",
    "ciencias naturales": "ciencias_naturales",
    ciencias_naturales: "ciencias_naturales",

    cs: "ciencias_sociales",
    sociales: "ciencias_sociales",
    "ciencias sociales": "ciencias_sociales",
    ciencias_sociales: "ciencias_sociales",

    en: "ingles",
    ing: "ingles",
    ingles: "ingles",
  };

  return map[s] || s;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalizeLetter(x) {
  if (!x) return "A";
  const L = x.toString().trim().toUpperCase();
  return ["A", "B", "C", "D"].includes(L) ? L : "A";
}

function normalizeOptionsToObject(q) {
  // options object
  if (q?.options && !Array.isArray(q.options) && typeof q.options === "object") {
    const A = q.options.A ?? q.options.a;
    const B = q.options.B ?? q.options.b;
    const C = q.options.C ?? q.options.c;
    const D = q.options.D ?? q.options.d;
    if (A != null && B != null && C != null && D != null) {
      return { A: String(A), B: String(B), C: String(C), D: String(D) };
    }
  }

  // optionA fields
  if (q.optionA || q.optionB || q.optionC || q.optionD) {
    return {
      A: String(q.optionA || ""),
      B: String(q.optionB || ""),
      C: String(q.optionC || ""),
      D: String(q.optionD || ""),
    };
  }

  // options array (strings or {letter,text})
  if (Array.isArray(q?.options)) {
    if (q.options[0]?.letter && q.options[0]?.text) {
      const out = { A: "", B: "", C: "", D: "" };
      q.options.forEach((op) => {
        const L = normalizeLetter(op.letter);
        out[L] = String(op.text ?? "");
      });
      return out;
    }
    const out = { A: "", B: "", C: "", D: "" };
    q.options.slice(0, 4).forEach((op, i) => {
      out[["A", "B", "C", "D"][i]] = String(op ?? "");
    });
    return out;
  }

  return { A: "", B: "", C: "", D: "" };
}

function normalizeQuestionForRealSim(raw) {
  const subject = normSubject(raw.subject);

  const contextText =
    raw?.context?.text ??
    raw?.context_text ??
    raw?.context ??
    "";

  const contextVisual =
    raw?.context?.visual ??
    raw?.visual ??
    null;

  const correct = normalizeLetter(raw.correct_letter || raw.answer);

  return {
    id: raw.id,
    subject,
    context: {
      text: String(contextText || ""),
      visual: contextVisual || null,
    },
    question: String(raw.question || ""),
    options: normalizeOptionsToObject(raw),
    answer: correct,
    correct_letter: correct,
    justification: raw.justification || "",
    skill: raw.skill || "",
    difficulty: raw.difficulty || "",
  };
}

function pickQuestions({ bank, subject, count, usedIds }) {
  const poolAll = bank.filter((q) => normSubject(q.subject) === subject);
  const poolNoRepeat = poolAll.filter((q) => !usedIds.has(q.id));

  const chosen = [];

  // 1) sin repetir primero
  for (const q of shuffle(poolNoRepeat)) {
    if (chosen.length >= count) break;
    chosen.push(q);
    usedIds.add(q.id);
  }

  // 2) relleno permitiendo repetición (forzar entrada)
  if (chosen.length < count) {
    const remaining = count - chosen.length;
    const refill = shuffle(poolAll).slice(0, remaining);
    chosen.push(...refill);
  }

  // 3) último recurso
  while (chosen.length < count && poolAll.length > 0) {
    chosen.push(poolAll[chosen.length % poolAll.length]);
  }

  return chosen;
}

export default function assembleRealSim({ bank, recentQuestionIds = [], seed = Date.now() }) {
  if (!Array.isArray(bank) || bank.length === 0) {
    throw new Error("Banco de preguntas inválido");
  }

  const usedIds = new Set(Array.isArray(recentQuestionIds) ? recentQuestionIds : []);

  const examPack = {
    meta: {
      examId: `realsim-${seed}`,
      seed,
      createdAt: new Date().toISOString(),
      totalQuestions: blueprint.exam.totalQuestions,
    },
    sessions: {
      session1: [],
      session2: [],
    },
  };

  for (const [sessionKey, sessionCfg] of Object.entries(blueprint.sessions)) {
    const sessionQuestions = [];

    for (const s of sessionCfg.subjects) {
      const picked = pickQuestions({
        bank,
        subject: s.subject,
        count: s.count,
        usedIds,
      });

      sessionQuestions.push(...picked.map(normalizeQuestionForRealSim));
    }

    examPack.sessions[sessionKey] = shuffle(sessionQuestions);
  }

  return examPack;
}
