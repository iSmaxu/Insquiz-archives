// services/quizService.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { fetchRemoteQuestions } from "./api"; // Tu api.js
import localData from "../data/questions.js";

/**
 * Verifica si hay conexión a internet (retorna true/false)
 */
export async function checkConnection() {
  const state = await NetInfo.fetch();
  return state.isConnected && state.isInternetReachable;
}

/**
 * Carga preguntas según la lógica de conexión y caché
 * @param {function} setBankStatus - (opcional) actualiza el estado visual del HomeScreen
 * @returns {object} Banco de preguntas final (online, cache o local)
 */
export async function loadQuestions(setBankStatus) {
  try {
    const hasInternet = await checkConnection();
    const lastOnline = await AsyncStorage.getItem("lastOnline");
    const cached = await AsyncStorage.getItem("cachedQuestions");

    // 🔹 Primera vez con internet
    if (hasInternet && !lastOnline) {
      const remote = await fetchRemoteQuestions();
      if (remote) {
        await AsyncStorage.setItem("cachedQuestions", JSON.stringify(remote));
        await AsyncStorage.setItem("lastOnline", new Date().toISOString());
        setBankStatus?.("online");
        console.log("🌐 Usando banco ONLINE (primera vez)");
        return remote;
      }
    }

    // 🔹 Primera vez sin internet
    if (!hasInternet && !lastOnline) {
      setBankStatus?.("local");
      console.log("💾 Usando banco LOCAL (primera vez sin conexión)");
      return localData;
    }

    // 🔹 No tiene internet pero ya tuvo antes
    if (!hasInternet && lastOnline) {
      if (cached) {
        setBankStatus?.("cached");
        console.log("🗄 Usando banco desde CACHÉ (sin conexión actual)");
        return JSON.parse(cached);
      } else {
        setBankStatus?.("local");
        console.log("💾 Sin conexión y sin caché, usando banco LOCAL");
        return localData;
      }
    }

    // 🔹 Tiene internet y ya tuvo antes
    if (hasInternet && lastOnline) {
      try {
        const remote = await fetchRemoteQuestions();
        if (remote) {
          await AsyncStorage.setItem("cachedQuestions", JSON.stringify(remote));
          await AsyncStorage.setItem("lastOnline", new Date().toISOString());
          setBankStatus?.("online");
          console.log("🌐 Banco ONLINE actualizado");
          return remote;
        }
      } catch {
        if (cached) {
          setBankStatus?.("cached");
          console.log("⚠️ Error al actualizar, usando banco en CACHÉ");
          return JSON.parse(cached);
        }
        setBankStatus?.("local");
        return localData;
      }
    }

    // 🔸 Último recurso
    setBankStatus?.("local");
    return localData;
  } catch (error) {
    console.error("❌ Error general en loadQuestions:", error);
    setBankStatus?.("local");
    return localData;
  }
}
// App/services/quizService.js
// App/services/quizService.js
import localQuestions from "../data/questions";
import distribution from "../data/real_distribution.json";

/**
 * Obtiene el banco de preguntas desde el servidor o localmente
 */
export async function getQuestions(mode = "normal") {
  try {
    // 1️⃣ Si es simulacro real:
    if (mode === "real") {
      const allQuestions = Object.entries(localQuestions).flatMap(([materia, lista]) =>
        lista.map((q) => ({ ...q, materia }))
      );

      const selected = buildRealSimulacro(allQuestions);
      return selected;
    }

    // 2️⃣ Si es modo normal:
    const cache = await AsyncStorage.getItem("cachedQuestions");
    if (cache) return JSON.parse(cache);

    // Si no hay cache, usa local
    return localQuestions;
  } catch (error) {
    console.error("❌ Error cargando preguntas:", error);
    return localQuestions;
  }
}

/**
 * Construye el simulacro con distribución oficial
 */
function buildRealSimulacro(allQuestions) {
  let selected = [];

  Object.entries(distribution).forEach(([materia, cantidad]) => {
    const preguntasMateria = allQuestions.filter((q) => q.materia === materia);

    if (preguntasMateria.length < cantidad) {
      console.warn(
        `⚠️ No hay suficientes preguntas en ${materia}. (${preguntasMateria.length}/${cantidad})`
      );
    }

    const randomSubset = shuffleArray(preguntasMateria).slice(0, cantidad);
    selected.push(...randomSubset);
  });

  return selected;
}

/**
 * Baraja un arreglo (algoritmo Fisher-Yates)
 */
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
