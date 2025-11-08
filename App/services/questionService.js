// App/services/questionService.js
// ==========================================================
// INSQUIZ - Servicio de Preguntas 100% Local (filtrado con contexto real)
// ==========================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import master from "../data/InsQUIZ_master_reindexed.json";
import { loadQuestionsCache } from "./quizService";

// ==========================================================
// 🔹 Obtener preguntas por área (Lectura, Matemáticas, etc.)
// ==========================================================
export async function getQuestionsByArea(area, count = 80) {
  try {
    const key = area.toLowerCase();

    // Cargar cache preprocesada (cada subject ya tiene context_text)
    const bank = await loadQuestionsCache();
    if (!bank) return [];

    // Map heurístico del área solicitada a la clave del dataset
    const patterns = [
      { p: "lectura" },
      { p: "mate" },
      { p: "social" },
      { p: "cienc" },
      { p: "ingl" },
    ];

    let subjectKey = Object.keys(bank)[0] || null;
    for (const { p } of patterns) {
      if (key.includes(p)) {
        const found = Object.keys(bank).find((k) => k.toLowerCase().includes(p));
        if (found) {
          subjectKey = found;
          break;
        }
      }
    }

    const data = bank[subjectKey] || [];
    const seleccionadas = shuffleArray(data).slice(0, count).map(q => ({ ...q }));

    // Guardar en caché local por área (opcional)
    await AsyncStorage.setItem(`questions_${subjectKey}`, JSON.stringify(seleccionadas));

    return seleccionadas;
  } catch (error) {
    console.error("❌ Error al cargar preguntas locales:", error);
    return [];
  }
}

// ==========================================================
export async function getQuestionsLocal(area) {
  try {
    const json = await AsyncStorage.getItem(`questions_${area.toLowerCase()}`);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

// ==========================================================
function normalizeQuestion(raw) {
  if (!raw) return null;

  // Si ya está en el formato correcto, retornarlo
  if (raw.pregunta && raw.respuestas && raw.correcta) return raw;

  // Si está en el formato del JSON master
  if (raw.question && raw.options && raw.answer) {
    // Crear objeto de respuestas
    const respuestas = {};
    const letters = ["a", "b", "c", "d"];
    raw.options.forEach((opt, i) => {
      // Limpiar el texto de la opción (quitar "A)", "B)", etc.)
      const text = opt.replace(/^[A-D]\)\s*/i, "").trim();
      respuestas[letters[i]] = text;
    });

    // Limpiar y normalizar la respuesta correcta
    const correcta = raw.answer.replace(/\)\s*/g, "").trim().toLowerCase();

    // Retornar objeto normalizado
    return {
      id: raw.id || "",
      pregunta: raw.question,
      respuestas,
      correcta,
      contexto: raw.context || "",
      justificacion: raw.justification || "",
      materia: raw.materia || (raw.skill && raw.skill.split(";")[0]) || "",
      habilidad: raw.skill || "",
      tipo: raw.type || "single"
    };
  }
  return null;
}
export { normalizeQuestion };
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
