// App/services/ai/localAI.js
import { NativeModules } from "react-native";

const { LocalLlama } = NativeModules;

let modelLoaded = false;
let warmStarted = false;

/**
 * Carga el modelo una única vez en toda la ejecución.
 */
export async function ensureLocalModelLoaded() {
  if (modelLoaded) return;

  console.log("AI >> Cargando modelo GGUF local...");
  const path = await ensureModelDownloaded();

  if (!LocalLlama) {
    throw new Error("El módulo nativo LocalLlama no está disponible.");
  }

  try {
    await LocalLlama.loadModel(path);
    console.log("AI >> Modelo cargado en el motor nativo.");
  } catch (err) {
    console.log("AI ERROR >> Falló loadModel:", err);
    throw err;
  }

  modelLoaded = true;
}

/**
 * Warm-up para que el primer mensaje no sea lento.
 */
async function warmUp() {
  if (warmStarted) return;
  warmStarted = true;

  try {
    console.log("AI >> Realizando warm-up...");
    await localChat("Hola, ¿estás listo?", { maxTokens: 5, temperature: 0.1 });
    console.log("AI >> Warm-up completado.");
  } catch {
    console.log("AI >> Warm-up falló (no es grave).");
  }
}

/**
 * Llamar a TinyLlama para obtener texto generado localmente.
 */
export async function localChat(prompt, opts = {}) {
  // Asegurar modelo cargado
  await ensureLocalModelLoaded();

  // Iniciar warm-up
  warmUp();

  const maxTokens = opts.maxTokens ?? 200;
  const temperature = opts.temperature ?? 0.7;

  console.log(`AI >> Prompt enviado (${prompt.length} caracteres)`);

  try {
    const result = await LocalLlama.generate(prompt, maxTokens, temperature);

    if (typeof result !== "string") return "";

    const cleaned = result
      .replace(/\s+/g, " ")
      .replace(/\n+/g, " ")
      .trim();

    console.log("AI >> Respuesta:", cleaned.slice(0, 60), "...");

    return cleaned;
  } catch (err) {
    console.log("AI ERROR >> generate falló:", err);
    return "⚠️ Error generando respuesta.";
  }
}
