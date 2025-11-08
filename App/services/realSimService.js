// ==========================================================
// INSQUIZ - Servicio de Simulacro Real (filtrado con contexto real)
// ==========================================================
import { loadQuestionsCache } from "./quizService";

export function getSimulacroReal() {
  try {
    // Cargar preguntas ya preprocesadas y cacheadas (solo con context_text)
    return (async () => {
      const bank = await loadQuestionsCache();
      const all = Object.values(bank || {}).flat();
      if (!all || all.length === 0) throw new Error("No hay preguntas disponibles para el simulacro");

      // Mezclar y tomar 80 preguntas para el simulacro real
      const shuffled = all.sort(() => Math.random() - 0.5);
  const selection = shuffled.slice(0, 80);
  return selection;
    })();
  } catch (e) {
    console.error("❌ Error generando simulacro:", e);
    return [];
  }
}

export const TIEMPO_POR_PREGUNTA = 150;
