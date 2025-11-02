// App/services/realSimProgressService.js
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Guarda el progreso actual del simulacro
 * @param {object} state - Datos actuales del simulacro
 */
export async function saveSimulacroProgress(state) {
  try {
    await AsyncStorage.setItem("simulacroProgress", JSON.stringify({
      ...state,
      lastSave: new Date().toISOString(),
    }));
  } catch (error) {
    console.error("❌ Error guardando progreso del simulacro:", error);
  }
}

/**
 * Carga el progreso guardado
 * @returns {object|null} estado guardado o null
 */
export async function getSimulacroProgress() {
  try {
    const stored = await AsyncStorage.getItem("simulacroProgress");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("❌ Error leyendo progreso del simulacro:", error);
    return null;
  }
}

/**
 * Elimina el progreso guardado (cuando se termina o reinicia)
 */
export async function clearSimulacroProgress() {
  try {
    await AsyncStorage.removeItem("simulacroProgress");
  } catch (error) {
    console.error("❌ Error limpiando progreso del simulacro:", error);
  }
}
