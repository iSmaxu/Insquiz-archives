import React, { useEffect, useState } from "react";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";

import RootNavigator from "./App/navigation/RootNavigator";

// Contexts
import { LicenseProvider, useLicense } from "./App/context/LicenseContext";
import { OfflineProvider, useOffline } from "./App/context/OfflineContext";

// Components
import OfflineLossBanner from "./App/components/OfflineLossBanner";

// Updates
import { UpdateProvider } from "./App/updates/UpdateContext";
import UpdateOverlay from "./App/components/UpdateOverlay";

// Guards
import ScreenCaptureGuard from "./App/config/ScreenCaptureGuard";
import MaintenanceGuard from "./App/services/MaintenanceService";

// ==========================================================
// OFFLINE + LICENSE GUARD
// ==========================================================

function OfflineGuard({ navigationRef }) {
  const { offlineLocked } = useOffline();
  const { licenseStatus } = useLicense();

  useEffect(() => {
    if (!navigationRef.current) return;

    const currentRoute =
      navigationRef.current.getCurrentRoute()?.name;

    // ❌ Licencia inválida → expulsión inmediata
    if (
      licenseStatus === "invalid" ||
      licenseStatus === "device_blocked"
    ) {
      if (currentRoute !== "LicenseScreen") {
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: "LicenseScreen" }],
        });
      }
      return;
    }

    // 📡 Offline vencido → pantalla Offline
    if (offlineLocked && currentRoute !== "OfflineScreen") {
      navigationRef.current.reset({
        index: 0,
        routes: [{ name: "OfflineScreen" }],
      });
    }
  }, [licenseStatus, offlineLocked]);

  return null;
}

// ==========================================================
// APP ROOT
// ==========================================================

export default function App() {
  const navigationRef = useNavigationContainerRef();
  const [currentRouteName, setCurrentRouteName] = useState(null);

  return (
    <LicenseProvider>
      <OfflineProvider>
        <UpdateProvider>
          <NavigationContainer
            ref={navigationRef}
            onReady={() => {
              const route =
                navigationRef.current.getCurrentRoute();
              setCurrentRouteName(route?.name);
            }}
            onStateChange={() => {
              const route =
                navigationRef.current.getCurrentRoute();
              setCurrentRouteName(route?.name);
            }}
          >
            {/* 🔔 Banner de pérdida de conexión */}
            <OfflineLossBanner />

            {/* 🧭 Navegación principal */}
            <RootNavigator />

            {/* 🛡️ Guards globales (ORDEN IMPORTA) }
            <OfflineGuard navigationRef={navigationRef} />
            <MaintenanceGuard navigationRef={navigationRef} />
            <ScreenCaptureGuard
              currentRouteName={currentRouteName}
            />*/}
          </NavigationContainer>

          {/* ⬆️ Overlay de updates */}
          <UpdateOverlay currentRouteName={currentRouteName} />
        </UpdateProvider>
      </OfflineProvider>
    </LicenseProvider>
  );
}
