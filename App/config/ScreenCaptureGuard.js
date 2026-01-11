// ==========================================================
//  SCREEN CAPTURE GUARD (GLOBAL) — BLOQUEO POR DENYLIST
// ==========================================================
// Android:
// - Usa FLAG_SECURE
// - Bloquea screenshots, grabación y screen mirroring
// - SOLO en rutas explícitamente listadas
//
// iOS:
// - No puede bloquear capturas (limitación del sistema)
// ==========================================================

import { useEffect } from "react";
import { Platform } from "react-native";
import * as ScreenCapture from "expo-screen-capture";
import { SCREENSHOT_BLOCKED_ROUTES } from "../config/screenCapturePolicy";

export default function ScreenCaptureGuard({ currentRouteName }) {
  useEffect(() => {
    if (Platform.OS !== "android") return;
    if (!currentRouteName) return;

    const shouldBlock = SCREENSHOT_BLOCKED_ROUTES.has(currentRouteName);

    if (shouldBlock) {
      // 🔒 FLAG_SECURE → bloquea screenshots + grabación
      ScreenCapture.preventScreenCaptureAsync();
    } else {
      // 🔓 Permite capturas normalmente
      ScreenCapture.allowScreenCaptureAsync();
    }
  }, [currentRouteName]);

  return null;
}
