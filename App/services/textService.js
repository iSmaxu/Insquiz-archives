// App/services/textService.js
// ==========================================================
// INSQUIZ - Text Service (versión final optimizada 2025)
// ==========================================================
// Carga los archivos de /data/textos/textos_***.json
// y busca el contexto correcto por "context_title".
// Primero busca en el archivo de la materia (según prefijo)
// y si no lo encuentra, busca globalmente.
// ==========================================================

let textsCache = {
  lectura: [],
  matematicas: [],
  ciencias_naturales: [],
  ciencias_sociales: [],
  ingles: [],
};
let indexedByTitle = {};
let loaded = false;

// ==========================================================
// Prefijos → Materia
// ==========================================================
const PREFIX_MAP = {
  LQ: "lectura",
  MT: "matematicas",
  CN: "ciencias_naturales",
  CS: "ciencias_sociales",
  EN: "ingles",
};

// ==========================================================
// 🚀 Precargar todos los textos e indexarlos por context_title
// ==========================================================
export async function preloadTexts() {
  if (loaded) return;
  try {
    console.log("⏳ Precargando textos de contexto...");

    textsCache.lectura = require("../data/textos/textos_lectura.json");
    textsCache.matematicas = require("../data/textos/textos_matematicas.json");
    textsCache.ciencias_naturales = require("../data/textos/textos_ciencias_naturales.json");
    textsCache.ciencias_sociales = require("../data/textos/textos_ciencias_sociales.json");
    textsCache.ingles = require("../data/textos/textos_ingles.json");

    // Crear índice global por título (por si el prefijo falla)
    indexedByTitle = {};
    Object.values(textsCache).forEach((arr) => {
      arr.forEach((item) => {
        if (item.context_title)
          indexedByTitle[item.context_title.trim()] = item;
      });
    });

    loaded = true;
    console.log("✅ Textos precargados y listos para consulta");
  } catch (error) {
    console.error("❌ Error al precargar textos:", error);
  }
}

// ==========================================================
// 🧩 Obtener texto completo para una pregunta
// ==========================================================
export function getTextForQuestion(question) {
  if (!question) return null;
  const title = question.context?.trim();
  if (!title) return null;

  // 1️⃣ Intentar deducir la materia a partir del prefijo del ID
  const prefix = question.id?.split("-")[0];
  const subjectKey = PREFIX_MAP[prefix] || null;

  // 2️⃣ Buscar en el archivo correspondiente si se conoce la materia
  if (subjectKey && textsCache[subjectKey]) {
    const found = textsCache[subjectKey].find(
      (t) => t.context_title?.trim() === title
    );
    if (found) return found;
  }

  // 3️⃣ Si no se encontró, buscar globalmente
  const foundGlobal = indexedByTitle[title];
  if (foundGlobal) return foundGlobal;

  // 4️⃣ Si tampoco está, mostrar algo por defecto
  console.warn("⚠️ Contexto no encontrado en textos/:", title);
  return {
    context_title: title,
    context_text: "(Texto no disponible en este momento.)",
  };
}
