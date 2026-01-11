import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@insquiz/instructor";

export async function loadInstructorState() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveInstructorState(state) {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
}
