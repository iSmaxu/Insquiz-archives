// App/engines/Chest_Engine.js
// ==========================================================
//  INSQUIZ - Chest Engine (cofres + admin varita)
// ==========================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import chestsConfig from "../data/chests.json";
import { XP_GetProfile } from "./XP_Engine";
import { getStats } from "../services/statsService";
import { getDailyStreak } from "../services/streakService";

const PENDING_KEY = "INSQUIZ_CHESTS_PENDING";
const OPENED_KEY  = "INSQUIZ_CHESTS_OPENED";

// Helpers
async function loadArray(key) {
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}
async function saveArray(key, arr) {
  await AsyncStorage.setItem(key, JSON.stringify(arr));
}
function findChestById(id) {
  return chestsConfig.find((c) => c.id === id);
}

// INVENTARIO
export async function Chest_GetInventory() {
  const pending = await loadArray(PENDING_KEY);
  const opened = await loadArray(OPENED_KEY);
  return { pending, opened };
}

// NORMAL EVENT
export async function Chest_RegisterEvent(eventName) {
  const pending = await loadArray(PENDING_KEY);
  const opened  = await loadArray(OPENED_KEY);
  const stats   = await getStats();
  const xp      = await XP_GetProfile();
  const streak  = await getDailyStreak();

  const now = Date.now();
  const today = new Date().toDateString();

  const grantedNow = [];

  for (const chest of chestsConfig) {
    const trigger = chest.trigger;
    const rules   = chest.rules || {};

    if (trigger.event !== eventName) continue;

    let ok = true;
    if (trigger.minStreak && streak < trigger.minStreak) ok = false;
    if (trigger.minLevel  && xp.level < trigger.minLevel) ok = false;
    if (trigger.minAnswered && stats.totalAnswered < trigger.minAnswered) ok = false;

    if (!ok) continue;

    // reglas
    const alreadyPending = pending.some((i) => i.chestId === chest.id);
    const alreadyOpened  = opened.some((i) => i.chestId === chest.id);

    // once
    if (rules.once && (alreadyPending || alreadyOpened)) continue;

    // oncePerDay
    if (rules.oncePerDay) {
      const hasToday =
        pending.some(
          (i) => i.chestId === chest.id && new Date(i.grantedAt).toDateString() === today
        ) ||
        opened.some(
          (i) => i.chestId === chest.id && new Date(i.grantedAt).toDateString() === today
        );

      if (hasToday) continue;
    }

    // crear instancia
    const instanceId = `${chest.id}_${now}_${Math.floor(Math.random() * 100000)}`;

    const instance = {
      instanceId,
      chestId: chest.id,
      grantedAt: now,
    };

    pending.push(instance);
    grantedNow.push(instance);
  }

  await saveArray(PENDING_KEY, pending);
  return grantedNow;
}

// ADMIN POWER
export async function Chest_GrantAdminChest(chestId) {
  const pending = await loadArray(PENDING_KEY);

  const chest = findChestById(chestId);
  if (!chest) throw new Error("Cofre no existe en chests.json");

  const now = Date.now();
  const instanceId = `${chestId}_${now}`;

  const inst = {
    instanceId,
    chestId: chest.id,
    grantedAt: now,
    admin: true,
  };

  pending.push(inst);
  await saveArray(PENDING_KEY, pending);

  return inst;
}

// OPEN
export async function Chest_Open(instanceId) {
  const pending = await loadArray(PENDING_KEY);
  const opened  = await loadArray(OPENED_KEY);

  const idx = pending.findIndex((p) => p.instanceId === instanceId);
  if (idx === -1) throw new Error("Cofre no encontrado.");

  const instance = pending[idx];
  pending.splice(idx, 1);

  const chest = findChestById(instance.chestId);
  const openedInst = {
    ...instance,
    openedAt: Date.now(),
  };

  opened.push(openedInst);

  await saveArray(PENDING_KEY, pending);
  await saveArray(OPENED_KEY, opened);

  return {
    chest,
    rewards: chest?.rewards,
    instance: openedInst,
  };
}

// RESET (dev)
export async function Chest_ResetAll() {
  await saveArray(PENDING_KEY, []);
  await saveArray(OPENED_KEY, []);
}
