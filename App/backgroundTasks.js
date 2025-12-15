// App/backgroundTasks.js
// ==========================================================
// INSQUIZ - Background Tasks (NEUTRALIZADO)
// ----------------------------------------------------------
// 🔕 Sin background fetch
// 🔕 Sin task manager
// 🔕 Sin notificaciones
// ❗ Expo Go NO soporta background tasks reales
// ==========================================================

export async function registerLicenseValidationTask() {
  if (__DEV__) {
    console.log("🔕 BackgroundTasks deshabilitado (Expo Go compatible)");
  }
  return false;
}
