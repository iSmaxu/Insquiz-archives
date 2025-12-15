// App/services/notificationService.js
// ==========================================================
// INSQUIZ - Notification Service (NEUTRALIZADO)
// ----------------------------------------------------------
// 🔕 Sin permisos
// 🔕 Sin tokens
// 🔕 Sin Firebase
// 🔕 Sin Expo Notifications
// ==========================================================

export async function registerAndSavePushToken() {
  if (__DEV__) {
    console.log("🔕 NotificationService deshabilitado (noop)");
  }
  return { ok: false, reason: "DISABLED" };
}
