// App/services/ai/tutorAI.js
// ==========================================================
// Chat Tutor IA - usa aiChatTutor (híbrido)
// ==========================================================

import { aiChatTutor } from "./aiRouter";

/**
 * Envía un mensaje del estudiante al Tutor IA
 * @param {string} message
 * @param {object} [context]
 *   - lastSkill?: string
 *   - lastSubject?: string
 */
export async function tutorMessageAI(message, context = {}) {
  const { lastSkill, lastSubject } = context;

  const prompt = `
Eres un tutor pedagógico especializado en el examen ICFES.
Responde de forma clara, amable, breve y enfocada en ayudar al estudiante.

Contexto opcional:
- Última materia trabajada: ${lastSubject || "desconocida"}
- Última skill trabajada: ${lastSkill || "desconocida"}

Mensaje del estudiante:
"${message}"

Responde en máximo 5 frases, muy claro y concreto.
`;

  const text = await aiChatTutor(prompt);
  return text.trim();
}
