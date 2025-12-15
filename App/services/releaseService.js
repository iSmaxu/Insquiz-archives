// App/services/releaseService.js
// =====================================================
// INSQUIZ — Release Service
// Mensaje de actualización estructurado
// Se muestra UNA sola vez por commit
// =====================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import releaseInfo from "../data/meta/release.json";

const STORAGE_KEY = "INSQUIZ_LAST_RELEASE_SHOWN";

function buildReleaseMessage() {
  const {
    subtitle,
    changes = [],
    footer,
  } = releaseInfo;

  let message = "";

  if (subtitle) {
    message += subtitle + "\n\n";
  }

  if (Array.isArray(changes) && changes.length > 0) {
    changes.forEach((item) => {
      message += `• ${item}\n`;
    });
    message += "\n";
  }

  if (footer) {
    message += footer;
  }

  return message.trim();
}

export async function checkAndShowReleaseMessage() {
  try {
    const { commit, title } = releaseInfo;

    if (!commit || !title) {
      console.log("⚠ release.json incompleto (commit o title faltante)");
      return;
    }

    const lastShown = await AsyncStorage.getItem(STORAGE_KEY);

    console.log("📦 Último release mostrado:", lastShown);
    console.log("🆕 Release actual:", commit);

    if (lastShown === commit) {
      console.log("✔ Release ya mostrado, no se repite");
      return;
    }

    const message = buildReleaseMessage();

    Alert.alert(
      title,
      message,
      [{ text: "Entendido" }]
    );

    await AsyncStorage.setItem(STORAGE_KEY, commit);
    console.log("✅ Release marcado como mostrado");
  } catch (err) {
    console.log("❌ Error en checkAndShowReleaseMessage:", err);
  }
}
