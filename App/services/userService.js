// App/services/userService.js
// =====================================================
// INSQUIZ — User Identity Service
// =====================================================

import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_ID_KEY = "insquiz_user_id";

export async function getCurrentUserId() {
  try {
    const uid = await AsyncStorage.getItem(USER_ID_KEY);
    return uid || null;
  } catch {
    return null;
  }
}
