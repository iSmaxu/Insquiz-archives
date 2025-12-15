// App/services/pushService.js
// ==========================================================
// INSQUIZ - Push Service (NEUTRALIZADO)
// ----------------------------------------------------------
// 🔕 Sistema de notificaciones DESACTIVADO
// - No solicita permisos
// - No genera tokens
// - No usa Firebase
// - No rompe imports
// - Compatible con Expo Go
// ==========================================================

export async function registerPushTokenInDB() {
  // Sistema de push deshabilitado intencionalmente
  // Se mantiene la función para no romper imports existentes

  if (__DEV__) {
    console.log("🔕 PushService deshabilitado (noop)");
  }

  return null;
}
