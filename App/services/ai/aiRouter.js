// App/services/ai/aiRouter.js
// ==========================================================
// Router IA - Decide si usar local o online según la tarea
// ==========================================================

import NetInfo from "@react-native-community/netinfo";
import { localChat } from "./localAI";
import { onlineChat } from "./onlineAI";

/**
 * Detecta si hay conexión a internet utilizable
 */
async function hasInternet() {
  const state = await NetInfo.fetch();
  return !!state.isConnected && !!state.isInternetReachable;
}

/**
 * Llama IA priorizando local (offline first).
 * - Si hay modelo local => se usa local siempre.
 * - Online solo se usa para tareas configuradas.
 */
export async function aiExplain(prompt) {
  // Explicaciones: SIEMPRE local (es la clave de InsQUIZ offline)
  return localChat(prompt, {
    maxTokens: 220,
    temperature: 0.5,
  });
}

/**
 * Chat tipo tutor: híbrido
 * - Si hay internet y quieres, puedes usar online
 * - Si no, local
 */
export async function aiChatTutor(prompt) {
  const onlineOk = await hasInternet();

  if (onlineOk) {
    try {
      return await onlineChat(prompt, {
        maxTokens: 300,
        temperature: 0.7,
      });
    } catch (e) {
      console.warn("Fallo IA online, usando local:", e);
      // fallback local
    }
  }

  return localChat(prompt, {
    maxTokens: 260,
    temperature: 0.7,
  });
}

/**
 * Generación de preguntas - por defecto solo intenta online.
 * Si no hay internet, devolvemos null o un mensaje.
 */
export async function aiGenerateQuestion(prompt) {
  const onlineOk = await hasInternet();
  if (!onlineOk) {
    // Podrías devolver una estructura fija tipo:
    // return { error: "Sin conexión para generación avanzada" };
    return null;
  }

  return onlineChat(prompt, {
    maxTokens: 512,
    temperature: 0.8,
  });
}
