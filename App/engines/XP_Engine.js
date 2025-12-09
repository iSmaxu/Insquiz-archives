// App/engines/XP_Engine.js
// ==========================================================
// INSQUIZ - XP Engine v1 (simple y robusto)
// ==========================================================
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@insquiz_xp_profile_v1";

// ------------------------
// CONFIG POR DEFECTO
// ------------------------
const DEFAULT_CONFIG = {
  xpPerCorrect: 10,
  bonus10: 20,
  bonusRealsim: 200,
  baseToNext: 100,      // XP para subir de nivel 1 → 2
  incrementPerLevel: 50 // cuánto aumenta el requerimiento por nivel
};

let xpConfig = { ...DEFAULT_CONFIG };

// Si existe App/data/xp_config.json, la usamos
try {
  // Ruta desde App/engines → App/data/xp_config.json
  // (Si aún no existe el archivo, simplemente usará DEFAULT_CONFIG)
  // eslint-disable-next-line global-require
  const fileCfg = require("../data/xp_config.json");
  xpConfig = { ...xpConfig, ...fileCfg };
  console.log("⚙️ XP config cargada desde xp_config.json:", xpConfig);
} catch (e) {
  console.log("ℹ️ XP config: usando configuración por defecto.", e.message);
}

// Constantes que usarán QuizScreen, RealSim, etc.
export const XP_PER_CORRECT = xpConfig.xpPerCorrect ?? 10;
export const XP_SESSION_BONUS_10 = xpConfig.bonus10 ?? 20;
export const XP_SESSION_BONUS_REALSIM = xpConfig.bonusRealsim ?? 200;

// ------------------------
// Helpers internos
// ------------------------
function getXpToNextLevel(level) {
  if (level <= 1) return xpConfig.baseToNext;
  return xpConfig.baseToNext + xpConfig.incrementPerLevel * (level - 1);
}

async function saveProfile(profile) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.log("❌ Error guardando perfil XP:", e);
  }
}

// ------------------------
// API PRINCIPAL
// ------------------------

// Devuelve siempre un perfil válido
export async function XP_GetProfile() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Crear perfil por defecto
      const newProfile = {
        level: 1,
        xp: 0,
        xpToNext: getXpToNextLevel(1),
        totalXp: 0,
        totalCorrect: 0,
        totalQuestions: 0
      };
      await saveProfile(newProfile);
      return newProfile;
    }

    const parsed = JSON.parse(raw);

    // Saneamos por si algo está roto
    const level = parsed.level || 1;
    const xp = isNaN(parsed.xp) ? 0 : parsed.xp;
    const totalXp = isNaN(parsed.totalXp) ? 0 : parsed.totalXp;
    const totalCorrect = parsed.totalCorrect || 0;
    const totalQuestions = parsed.totalQuestions || 0;
    const xpToNext = getXpToNextLevel(level);

    const profile = {
      level,
      xp,
      xpToNext,
      totalXp,
      totalCorrect,
      totalQuestions,
    };

    await saveProfile(profile);
    return profile;
  } catch (e) {
    console.log("❌ Error cargando perfil XP, creando uno nuevo:", e);
    const fallback = {
      level: 1,
      xp: 0,
      xpToNext: getXpToNextLevel(1),
      totalXp: 0,
      totalCorrect: 0,
      totalQuestions: 0,
    };
    await saveProfile(fallback);
    return fallback;
  }
}

// Suma XP y gestiona subidas de nivel
export async function XP_Add(amount, opts = {}) {
  try {
    const delta = Number(amount) || 0;
    if (delta <= 0) {
      return XP_GetProfile(); // no sumamos nada
    }

    let profile = await XP_GetProfile();

    profile.xp += delta;
    profile.totalXp += delta;

    // Si viene info de preguntas, opcionalmente actualizamos stats básicos
    if (typeof opts.correct === "boolean") {
      profile.totalQuestions += 1;
      if (opts.correct) profile.totalCorrect += 1;
    }

    // Manejo de subida de nivel (puede subir varios niveles si acumula mucho XP)
    let leveledUp = false;
    while (profile.xp >= profile.xpToNext) {
      profile.xp -= profile.xpToNext;
      profile.level += 1;
      profile.xpToNext = getXpToNextLevel(profile.level);
      leveledUp = true;
    }

    await saveProfile(profile);

    if (leveledUp) {
      console.log(
        `⭐ Subiste al nivel ${profile.level}! XP actual: ${profile.xp}/${profile.xpToNext}`
      );
    }

    return profile;
  } catch (e) {
    console.log("❌ Error en XP_Add:", e);
    return XP_GetProfile();
  }
}

// Para dev: borrar XP
export async function XP_Reset() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log("🧹 XP_Reset: Perfil de XP borrado.");
    return XP_GetProfile();
  } catch (e) {
    console.log("❌ Error en XP_Reset:", e);
    return XP_GetProfile();
  }
}
