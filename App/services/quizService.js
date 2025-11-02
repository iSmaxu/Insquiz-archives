// services/quizService.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchRemoteQuestions } from "../api"; // tu api.js

const LOCAL_PATH = require("../data/questions.json");

/**
 * Verifica conexión a internet
 */
export async function checkConnection() {
  try {
    const response = await fetch("https://www.google.com", { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Carga preguntas segun el flujo de conexión y cache
 */
export async function loadQuestions() {
  const hasInternet = await checkConnection();
  const lastOnline = await AsyncStorage.getItem("lastOnline");
  const cached = await AsyncStorage.getItem("cachedQuestions");

  // Primera vez con internet
  if (hasInternet && !lastOnline) {
    const remote = await fetchRemoteQuestions();
    if (remote) {
      await AsyncStorage.setItem("cachedQuestions", JSON.stringify(remote));
      await AsyncStorage.setItem("lastOnline", new Date().toISOString());
      return remote;
    }
  }

  // Sin internet (primera vez)
  if (!hasInternet && !lastOnline) {
    console.log("📴 Sin conexión, usando banco local.");
    return LOCAL_PATH;
  }

  // Segunda vez o más
  if (!hasInternet && lastOnline) {
    console.log("📴 Sin conexión esta vez, usando caché.");
    return JSON.parse(cached);
  }

  // Tiene internet ahora
  if (hasInternet && lastOnline) {
    try {
      const remote = await fetchRemoteQuestions();
      if (remote) {
        await AsyncStorage.setItem("cachedQuestions", JSON.stringify(remote));
        await AsyncStorage.setItem("lastOnline", new Date().toISOString());
        return remote;
      }
    } catch {
      console.log("⚠️ Error actualizando banco, usando caché.");
      return JSON.parse(cached);
    }
  }

  // Último recurso
  return LOCAL_PATH;
}
