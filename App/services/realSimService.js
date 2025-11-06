// ==========================================================
// INSQUIZ - Servicio de Simulacro Real (filtrado con contexto real)
// ==========================================================
import preguntasData from "../data/InsQUIZ_master_reindexed.json";
import { attachContextToPregunta } from "./contextService";

export function getSimulacroReal() {
  try {
    let allQuestions = [];

    if (Array.isArray(preguntasData)) {
      allQuestions = preguntasData;
    } else if (typeof preguntasData === "object") {
      Object.values(preguntasData).forEach((arr) => {
        if (Array.isArray(arr)) allQuestions.push(...arr);
      });
    }

    if (!allQuestions.length) {
      throw new Error("No se encontraron preguntas en InsQUIZ_master_reindexed.json");
    }

    // 1. Filtrado estricto: solo preguntas con contexto válido
    allQuestions = allQuestions
      .map(q => attachContextToPregunta(q))
      .filter(q => q !== null); // null indica que no pasó las validaciones de contexto

    if (allQuestions.length === 0) {
      throw new Error("❌ No hay preguntas con contexto válido para el simulacro");
    }

    const areas = {
      matematicas: allQuestions.filter((q) => q.id?.startsWith("MT")).slice(0, 50),
      lectura: allQuestions.filter((q) => q.id?.startsWith("LQ")).slice(0, 41),
      sociales: allQuestions.filter((q) => q.id?.startsWith("CS")).slice(0, 50),
      naturales: allQuestions.filter((q) => q.id?.startsWith("CN")).slice(0, 58),
      ingles: allQuestions.filter((q) => q.id?.startsWith("EN")).slice(0, 55),
    };

    const combined = [
      ...areas.matematicas,
      ...areas.lectura,
      ...areas.sociales,
      ...areas.naturales,
      ...areas.ingles,
    ];

    console.log("✅ Simulacro armado con", combined.length, "preguntas con contexto real");
    return combined;
  } catch (e) {
    console.error("❌ Error generando simulacro:", e);
    return [];
  }
}

export const TIEMPO_POR_PREGUNTA = 150;
