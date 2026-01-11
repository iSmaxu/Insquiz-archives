// App/engines/XP_Engine.js
// ==========================================================
// INSQUIZ - XP Engine v1.1 (simple y robusto)
// ✅ Perfil saneado siempre
// ✅ Suma XP + stats (correct/totalQuestions)
// ✅ Multi-level up
// ✅ Bonus de sesión
// ✅ Config opcional desde App/data/xp_config.json
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
  baseToNext: 100,
  incrementPerLevel: 50,
};

let xpConfig = { ...DEFAULT_CONFIG };

// Si existe App/data/xp_config.json, la usamos
try {
  // eslint-disable-next-line global-require
  const fileCfg = require("../data/xp_config.json");
  xpConfig = { ...xpConfig, ...fileCfg };
  console.log("⚙️ XP config cargada desde xp_config.json:", xpConfig);
} catch (e) {
  console.log("ℹ️ XP config: usando configuración por defecto.", e?.message);
}

// Constantes públicas
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
export async function XP_GetProfile() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);

    if (!raw) {
      const newProfile = {
        level: 1,
        xp: 0,
        xpToNext: getXpToNextLevel(1),
        totalXp: 0,
        totalCorrect: 0,
        totalQuestions: 0,
      };
      await saveProfile(newProfile);
      return newProfile;
    }

    const parsed = JSON.parse(raw);

    const level = parsed?.level || 1;
    const xp = isNaN(parsed?.xp) ? 0 : Number(parsed.xp);
    const totalXp = isNaN(parsed?.totalXp) ? 0 : Number(parsed.totalXp);
    const totalCorrect = parsed?.totalCorrect || 0;
    const totalQuestions = parsed?.totalQuestions || 0;
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

export async function XP_Add(amount, opts = {}) {
  try {
    const delta = Number(amount) || 0;

    let profile = await XP_GetProfile();

    // ✅ stats de preguntas: cuentan incluso si delta = 0
    if (typeof opts.correct === "boolean") {
      profile.totalQuestions += 1;
      if (opts.correct) profile.totalCorrect += 1;
    }

    // ✅ XP (puede ser 0 si fue incorrecta)
    if (delta > 0) {
      profile.xp += delta;
      profile.totalXp += delta;
    }

    // Subida de nivel (puede subir varios)
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
