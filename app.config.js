// app.config.js
// =====================================================
//  INSQUIZ — Config LIMPIA (SIN NOTIFICACIONES)
//  Compatible con Expo SDK 54 + Expo Go
// =====================================================
const { execSync } = require("child_process");

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
    orientation: "portrait",
    icon: "./assets/icon.png",
    platforms: ["ios", "android"],

    updates: {
      enabled: true,
      checkAutomatically: "ON_LOAD",
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/88af70c7-f822-49b4-8572-1fb698b71413"
    },

    runtimeVersion: "1.2.0",
    assetBundlePatterns: ["**/*"],

    android: {
      package: "com.samux.inc.quizapp",

      // ❌ Sin API de notificaciones
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      }
    },

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.samux.inc.quizapp"
    },

    // ❌ SIN notification:
    // ❌ SIN expo-notifications
    // ❌ SIN permisos
    // ❌ SIN OneSignal

    plugins: [
      // Solo lo que realmente usas
      "expo-secure-store",

      [
        "expo-build-properties",
        {
          android: {
            minSdkVersion: 24,
            compileSdkVersion: 36,
            targetSdkVersion: 36
          }
        }
      ]
    ],

    extra: {
      eas: {
        projectId: "88af70c7-f822-49b4-8572-1fb698b71413"
      },
      commit
    }
  }
};
