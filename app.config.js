// app.config.js
// =====================================================
// INSQUIZ — Config oficial FCM 2025 (compatible EAS)
// =====================================================
const { execSync } = require("child_process");

// Obtener commit
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

    updates: {
      enabled: true,
      checkAutomatically: "ON_LOAD",
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/88af70c7-f822-49b4-8572-1fb698b71413"
    },

    runtimeVersion: "1.2.0",
    assetBundlePatterns: ["**/*"],

    android: {
      package: "com.samux_inc.quizapp",

      // 🔥 Requerido para FCM real
      useNextNotificationsApi: true,

      // 🔥 Path correcto
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

    notification: {
      icon: "./assets/notification-icon.png",
      color: "#6A0DAD",
      androidMode: "default",
      androidCollapsedTitle: "InsQUIZ"
    },

    plugins: [
      "expo-secure-store",
      "expo-notifications",
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

      // 🔥 OPCIONAL — NO se necesita para recibir tokens
      fcmServerKey: "IGNÓRALA / NO NECESARIA",

      commit
    }
  }
};
