import { localChat } from "./localAI";

export async function explainAnswerAI(question) {
  const prompt = `
Eres un tutor pedagógico experto en el examen ICFES tipo Saber 11.
Explica si la respuesta del estudiante es correcta o incorrecta, en máximo 5 líneas.

Pregunta:
${question.question}

Texto / contexto:
${question.context_text ?? "Sin contexto adicional"}

Respuesta del estudiante: ${question.user_answer}
Respuesta correcta: ${question.answer}
Habilidad: ${question.skill}

Explicación:
`;

  const out = await localChat(prompt, { maxTokens: 160, temperature: 0.6 });
  return out;
}
