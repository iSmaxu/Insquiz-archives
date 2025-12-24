import { useEffect } from "react";
import { Platform } from "react-native";
import * as ScreenCapture from "expo-screen-capture";
import { SCREENSHOT_ALLOWED_ROUTES } from "../config/screenCapturePolicy";

// ==========================================================
//  SCREEN CAPTURE GUARD (GLOBAL)
// ==========================================================
// Android:
// - Bloquea screenshots y grabación de pantalla
// - Reactivo a la ruta actual
// iOS:
// - No hace nada (limitación del sistema)
// ==========================================================

export default function ScreenCaptureGuard({ currentRouteName }) {
  useEffect(() => {
    if (Platform.OS !== "android") return;
    if (!currentRouteName) return;

    const isAllowed = SCREENSHOT_ALLOWED_ROUTES.has(currentRouteName);

    if (isAllowed) {
      ScreenCapture.allowScreenCaptureAsync();
    } else {
      ScreenCapture.preventScreenCaptureAsync();
    }
  }, [currentRouteName]);

  return null;
}
