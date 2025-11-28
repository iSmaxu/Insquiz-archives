// App/services/ai/onlineAI.js
// ==========================================================
// IA ONLINE (opcional) - Cloudflare / OpenAI / lo que uses
// ==========================================================

const API_URL = "https://tu-backend.com/api/ai/chat"; // placeholder

export async function onlineChat(prompt, options = {}) {
  const body = {
    prompt,
    ...options,
  };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Si necesitas JWT o algo, lo pones aquí
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Error en IA online: " + res.status);
  }

  const data = await res.json();
  // suponemos que la respuesta viene en data.text
  return data.text;
}
