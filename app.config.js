// app.config.js
// =====================================================
// INSQUIZ — Config oficial 2025
// Con soporte completo para:
//  - Expo SDK 54
//  - OTA Updates + Commit Hash
//  - Push Notifications (FCM)
//  - Android build compatible con expo-notifications
// =====================================================

const { execSync } = require("child_process");

// =====================================================
// obtener commit (como ya lo tenías antes)
// =====================================================
function getGitCommit() {
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch (e) {
    return "unknown";
  }
}

const commit = getGitCommit();

module.exports = {
  expo: {
    name: "InsQUIZ",
    slug: "ins-quiz",
    version: "1.0.0",
    sdkVersion: "54.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    platforms: ["ios", "android"],

    // =====================================================
    // OTA UPDATES con commit
    // =====================================================
    updates: {
      enabled: true,
      checkAutomatically: "ON_LOAD",
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/88af70c7-f822-49b4-8572-1fb698b71413"
    },

    runtimeVersion: "1.2.0",

    assetBundlePatterns: ["**/*"],

    // =====================================================
    // ANDROID — donde sí necesitamos cambios reales
    // =====================================================
    android: {
      package: "com.samux_inc.quizapp",

      // 🔥 Requerido para expo-notifications en builds reales
      useNextNotificationsApi: true,

      // 🔥 Requerido para FCM (debes tener google-services.json)
      googleServicesFile: "./google-services.json",

      permissions: [
        "NOTIFICATIONS",
        "VIBRATE",
        "com.google.android.c2dm.permission.RECEIVE"
      ],

      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#6A0DAD"
      }
    },

    ios: {
      supportsTablet: true
    },

    // =====================================================
    // NOTIFICATIONS
    // =====================================================
    notification: {
      icon: "./assets/notification-icon.png",
      color: "#6A0DAD",
      androidMode: "default",
      androidCollapsedTitle: "InsQUIZ"
    },

    // =====================================================
    // PLUGINS
    // =====================================================
    plugins: [
  "expo-secure-store",
  "expo-notifications",
  [
    "expo-build-properties",
    {
      android: {
        minSdkVersion: 24,
        compileSdkVersion: 34,
        targetSdkVersion: 34
      }
    }
  ]
],


    // =====================================================
    // EXTRA CONSTANTS
    // =====================================================
    extra: {
      eas: {
        projectId: "88af70c7-f822-49b4-8572-1fb698b71413"
      },

      // 🔥 NUEVO: clave FCM añadida directamente
      fcmServerKey: "AIzaSyCGF.....",

      // commit actual del repo
      commit
    }
  }
};
