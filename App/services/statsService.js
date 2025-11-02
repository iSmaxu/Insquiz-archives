// App/services/statsService.js
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Guarda una respuesta en el sistema de estadísticas
 * @param {string} skill - Habilidad evaluada (por ejemplo "Comprensión lectora")
 * @param {boolean} correcta - true si respondió bien
 */
export async function saveProgress(skill, correcta) {
  try {
    const stored = await AsyncStorage.getItem("stats");
    let data = stored
      ? JSON.parse(stored)
      : {
          totalRespondidas: 0,
          totalCorrectas: 0,
          skills: {},
          lastUpdate: new Date().toISOString(),
        };

    data.totalRespondidas += 1;
    if (correcta) data.totalCorrectas += 1;

    if (!data.skills[skill]) data.skills[skill] = { buenas: 0, malas: 0 };
    if (correcta) data.skills[skill].buenas += 1;
    else data.skills[skill].malas += 1;

    data.lastUpdate = new Date().toISOString();

    await AsyncStorage.setItem("stats", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("❌ Error guardando progreso:", error);
  }
}

/**
 * Obtiene las estadísticas actuales
 * @returns {object} datos de rendimiento o null
 */
export async function getStats() {
  try {
    const stored = await AsyncStorage.getItem("stats");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("❌ Error obteniendo estadísticas:", error);
    return null;
  }
}

/**
 * Reinicia todas las estadísticas (opcional)
 */
export async function resetStats() {
  try {
    await AsyncStorage.removeItem("stats");
    console.log("✅ Estadísticas reiniciadas");
  } catch (error) {
    console.error("❌ Error reiniciando estadísticas:", error);
  }
}
