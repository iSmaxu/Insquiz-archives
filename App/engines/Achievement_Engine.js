// App/engines/Achievement_Engine.js
// ==========================================================
// INSQUIZ - Achievement Engine v1
// ==========================================================

import { getStats } from "../services/statsService";
import { XP_GetProfile } from "./XP_Engine";

const ACHIEVEMENTS = [
  {
    id: "first_steps",
    name: "Primeros pasos",
    description: "Responde 10 preguntas.",
    check: (stats) => stats.totalAnswered >= 10,
    progress: (stats) => Math.min(stats.totalAnswered / 10, 1),
  },
  {
    id: "hundred_answers",
    name: "Centurión",
    description: "Responde 100 preguntas.",
    check: (stats) => stats.totalAnswered >= 100,
    progress: (stats) => Math.min(stats.totalAnswered / 100, 1),
  },
  {
    id: "accuracy_70",
    name: "Buen ojo",
    description: "Mantén 70% de precisión global.",
    check: (stats) =>
      stats.totalAnswered > 0 &&
      stats.totalCorrect / stats.totalAnswered >= 0.7,
    progress: (stats) =>
      stats.totalAnswered === 0
        ? 0
        : Math.min(stats.totalCorrect / (stats.totalAnswered * 0.7), 1),
  },
  {
    id: "perfect_10",
    name: "Impecable",
    description: "Logra un quiz perfecto de 10 preguntas.",
    check: (stats) => stats.bestPerfect >= 10,
    progress: (stats) => Math.min(stats.bestPerfect / 10, 1),
  },
  {
    id: "level_5",
    name: "En ascenso",
    description: "Alcanza el nivel 5.",
    check: (_, xp) => xp.level >= 5,
    progress: (_, xp) => Math.min(xp.level / 5, 1),
  },
];

// ----------------------------------------------------------
export async function evaluateAchievements() {
  const stats = await getStats();
  const xp = await XP_GetProfile();

  const unlocked = [];
  const locked = [];

  ACHIEVEMENTS.forEach((ach) => {
    const ok = ach.check(stats, xp);
    const prog = ach.progress ? ach.progress(stats, xp) : ok ? 1 : 0;

    const entry = {
      id: ach.id,
      name: ach.name,
      description: ach.description,
      progress: prog,
    };

    if (ok) unlocked.push(entry);
    else locked.push(entry);
  });

  return { unlocked, locked };
}
