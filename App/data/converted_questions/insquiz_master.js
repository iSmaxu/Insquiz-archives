/* ===========================================================
   INSQUIZ MASTER — Importación INDIVIDUAL garantizada
   Soluciona el problema de 216 preguntas en RealSim
=========================================================== */

// Importación directa de cada archivo
import CN from "./converted_questions/cn";
import MT from "./converted_questions/mt";
import LQ_raw from "./converted_questions/lq";
import CS from "./converted_questions/cs";
import EN from "./converted_questions/en";

// 🔍 Normalización adicional por si algún subject viene mal normalizado
const normalize = (arr) =>
  arr.map((q) => {
    let s = (q.subject || "").toLowerCase().trim();

    if (s.includes("lect")) s = "lectura_critica";
    if (s.includes("mate")) s = "matematicas";
    if (s.includes("natur")) s = "ciencias_naturales";
    if (s.includes("social")) s = "ciencias_sociales";
    if (s.includes("ingl")) s = "ingles";

    return { ...q, subject: s };
  });

// Normalizamos LQ para evitar inconsistencias
const LQ = normalize(LQ_raw);

// Ensamblado final
const master = [
  ...normalize(CN),
  ...normalize(MT),
  ...normalize(LQ),
  ...normalize(CS),
  ...normalize(EN),
];

// Log para asegurar que cargó TODO
console.log("📌 INSQUIZ MASTER CARGADO:");
console.log(
  master.reduce((acc, q) => {
    acc[q.subject] = (acc[q.subject] || 0) + 1;
    return acc;
  }, {})
);

export default master;
