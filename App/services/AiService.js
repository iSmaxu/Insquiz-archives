// App/services/AIService.js

const IA_API_URL = "https://insquiz-ia-main.insquiz.workers.dev/chat";
// TODO: cámbialo cuando tengamos el worker desplegado.

/**
 * Envía un prompt de texto al servidor IA y devuelve la respuesta en texto plano.
 * El servidor se encargará de:
 *  - Intentar LLaMA 3 8B Instruct (Meta)
 *  - Si falla, usar Phi-3 Mini (Microsoft)
 */
export async function askIA(prompt, options = {}) {
  const {
    maxTokens = 512,
    temperature = 0.7,
    systemPrompt = "Eres un tutor experto en exámenes tipo ICFES para estudiantes de secundaria en Colombia."
  } = options;

  try {
    const response = await fetch(IA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemPrompt,
        prompt,
        maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      console.warn("[AIService] Error HTTP:", response.status, await response.text());
      throw new Error("IA_SERVER_ERROR");
    }

    const data = await response.json();

    // Esperamos algo como: { success: true, model: "llama3"|"phi3", text: "..." }
    if (!data || !data.text) {
      throw new Error("IA_INVALID_RESPONSE");
    }

    return {
      text: data.text,
      model: data.model || "unknown",
    };
  } catch (error) {
    console.error("[AIService] Error consultando IA:", error);
    throw error;
  }
}

/**
 * Ejemplo específico para generar una justificación de respuesta.
 * Recibe:
 *  - question: enunciado de la pregunta
 *  - options: arreglo de opciones
 *  - correctIndex: índice de la opción correcta (0..3)
 */
export async function generateJustificationForQuestion({ question, options, correctIndex }) {
  const correctOption = options[correctIndex];

  const prompt = `
Eres un tutor experto en exámenes ICFES. 
Te daré una pregunta de opción múltiple, sus opciones y cuál es la correcta. 
Tu tarea es generar una justificación clara, en español, dirigida a un estudiante, explicando por qué esa opción es correcta y, de ser útil, por qué las otras no lo son.

Formato:
- No menciones "opción A/B/C", solo describe el contenido.
- Usa entre 3 y 8 líneas máximo.
- Lenguaje sencillo, pero sólido académicamente.

Pregunta:
"${question}"

Opciones:
${options.map((opt, i) => `- ${i + 1}. ${opt}`).join("\n")}

La respuesta correcta es:
"${correctOption}"

Genera ahora la justificación:
  `.trim();

  const { text } = await askIA(prompt, {
    maxTokens: 400,
    temperature: 0.4,
  });

  return text.trim();
}
// App/services/AiService.js