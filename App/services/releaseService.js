// =====================================================
// INSQUIZ — Release Service (GLOBAL)
// Muestra UNA sola vez por commit global
// =====================================================

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import releaseInfo from "../data/meta/release.json";

const STORAGE_KEY = "INSQUIZ_LAST_RELEASE_SHOWN_GLOBAL";

function buildMessage() {
  const { subtitle, changes = [], footer } = releaseInfo;

  let msg = "";
  if (subtitle) msg += subtitle + "\n\n";

  if (Array.isArray(changes) && changes.length > 0) {
    changes.forEach((c) => (msg += `• ${c}\n`));
    msg += "\n";
  }

  if (footer) msg += footer;
  return msg.trim();
}

export async function checkAndShowGlobalRelease() {
  try {
    const { commit, title } = releaseInfo;

    if (!commit || !title) {
      console.log("⚠ [GLOBAL] release.json incompleto (commit/title)");
      return;
    }

    const lastShown = await AsyncStorage.getItem(STORAGE_KEY);

    console.log("📦 [GLOBAL] lastShown:", lastShown);
    console.log("🆕 [GLOBAL] commit:", commit);

    if (lastShown === commit) {
      console.log("✔ [GLOBAL] ya mostrado, no se repite");
      return;
    }

    const message = buildMessage();
    if (!message) {
      console.log("⚠ [GLOBAL] mensaje vacío");
      return;
    }

    Alert.alert(title, message, [{ text: "Entendido" }]);
    await AsyncStorage.setItem(STORAGE_KEY, commit);

    console.log("✅ [GLOBAL] marcado como mostrado");
  } catch (err) {
    console.log("❌ [GLOBAL] error:", err);
  }
}
