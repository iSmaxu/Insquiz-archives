// App/services/achievementEngine.js
// ==========================================================
//  INSQUIZ - Motor de Logros (dinámico + secretos + racha)
// ==========================================================

import achievements from "../data/achievements.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { XP_GetProfile } from "./XP_Engine";
import { getStats } from "../services/statsService";
import { getDailyStreak } from "../services/streakService";

const STORAGE_KEY = "INSQUIZ_ACHIEVEMENTS_UNLOCKED";

/**
 * Devuelve objeto { [idLogro]: { unlockedAt: timestamp } }
 */
export async function getUnlockedAchievements() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

async function saveUnlockedAchievementsMap(map) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

/**
 * Evalúa TODO:
 * - Usa stats + xp + streak
 * - Marca logros desbloqueados en AsyncStorage
 * - Devuelve:
 *   { unlocked[], locked[], newlyUnlocked[] }
 */
export async function evaluateAchievements() {
  const stats = await getStats();
  const xp = await XP_GetProfile();

  const unlockedDB = await getUnlockedAchievements();
  const streak = await getDailyStreak();

  const unlocked = [];
  const locked = [];
  const newlyUnlocked = [];

  // valores defensivos
  const modes = stats.modes || {};
  const subjects = stats.subjects || {};
  const skills = stats.skills || {};

  const globalAccuracy =
    stats.totalAnswered > 0
      ? (stats.totalCorrect / stats.totalAnswered) * 100
      : 0;

  // mejor skill (porcentaje)
  let bestSkillPct = 0;
  Object.values(skills).forEach((sk) => {
    const pct = sk.total > 0 ? (sk.correct / sk.total) * 100 : 0;
    if (pct > bestSkillPct) bestSkillPct = pct;
  });

  // “perfect_quiz” asume que stats.bestPerfect existe (máximo correctas en un solo quiz)
  const bestPerfect = stats.bestPerfect || 0;

  const newUnlockedMap = { ...unlockedDB };

  achievements.forEach((ach) => {
    const req = ach.requirement || {};
    let ok = false;

    switch (req.type) {
      case "total_answered":
        ok = stats.totalAnswered >= (req.value || 0);
        break;

      case "total_correct":
        ok = stats.totalCorrect >= (req.value || 0);
        break;

      case "global_accuracy":
        ok = globalAccuracy >= (req.value || 0);
        break;

      case "level_reached":
        ok = xp.level >= (req.value || 0);
        break;

      case "mode_played":
        ok = (modes[req.mode]?.total || 0) >= (req.value || 0);
        break;

      case "subject_accuracy": {
        const sub = subjects[req.subject];
        if (sub && sub.total > 0) {
          const pct = (sub.correct / sub.total) * 100;
          ok = pct >= (req.value || 0);
        }
        break;
      }

      case "daily_streak":
        ok = streak >= (req.value || 0);
        break;

      case "best_skill_over":
        ok = bestSkillPct >= (req.value || 0);
        break;

      case "perfect_quiz":
        ok = bestPerfect >= (req.value || 0);
        break;

      default:
        console.log("⚠ Tipo de requerimiento desconocido:", req.type);
        ok = false;
    }

    if (ok) {
      unlocked.push(ach);

      // ¿es la primera vez que se desbloquea?
      if (!unlockedDB[ach.id]) {
        newlyUnlocked.push(ach);
        newUnlockedMap[ach.id] = { unlockedAt: Date.now() };
      }
    } else {
      locked.push(ach);
    }
  });

  if (newlyUnlocked.length > 0) {
    await saveUnlockedAchievementsMap(newUnlockedMap);
  }

  return { unlocked, locked, newlyUnlocked };
}
