// App/services/streakService.js
// ==============================================
//  INSQUIZ - Racha diaria
// ==============================================
import AsyncStorage from "@react-native-async-storage/async-storage";

const STREAK_KEY = "INSQUIZ_STREAK";
const LAST_DAY_KEY = "INSQUIZ_LAST_DAY";

/**
 * Llamar cuando el usuario haga “actividad válida del día”.
 * Por ejemplo: al terminar un quiz o un RealSim.
 */
export async function updateDailyStreak() {
  const todayStr = new Date().toDateString();
  const last = await AsyncStorage.getItem(LAST_DAY_KEY);
  let streak = parseInt((await AsyncStorage.getItem(STREAK_KEY)) || "0", 10);

  if (!last) {
    await AsyncStorage.setItem(LAST_DAY_KEY, todayStr);
    await AsyncStorage.setItem(STREAK_KEY, "1");
    return 1;
  }

  if (last === todayStr) {
    // ya contamos hoy
    return streak || 1;
  }

  const lastDate = new Date(last);
  const today = new Date(todayStr);
  const diffDays =
    (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDays === 1) {
    streak = (streak || 0) + 1; // día consecutivo
  } else {
    streak = 1; // racha rota
  }

  await AsyncStorage.setItem(LAST_DAY_KEY, todayStr);
  await AsyncStorage.setItem(STREAK_KEY, String(streak));
  return streak;
}

export async function getDailyStreak() {
  const raw = await AsyncStorage.getItem(STREAK_KEY);
  return parseInt(raw || "0", 10);
}
