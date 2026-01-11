// App.js
// ==========================================================
// INSQUIZ — APP ROOT (lastSeen optimizado)
// ==========================================================

import React, { useEffect, useState } from "react";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { AppState } from "react-native";

import RootNavigator from "./App/navigation/RootNavigator";

// Console Interceptor
import "./App/debug/ConsoleInterceptor";

// Instructor
import { InstructorProvider } from "./App/instructor/InstructorProvider";
import InstructorCard from "./App/instructor/InstructorCard";

// Contexts
import { LicenseProvider, useLicense } from "./App/context/LicenseContext";
import { OfflineProvider, useOffline } from "./App/context/OfflineContext";

// Components
import OfflineLossBanner from "./App/components/OfflineLossBanner";
import OfflineRecoveryBanner from "./App/components/OfflineRecoveryBanner";

// Updates
import { UpdateProvider } from "./App/updates/UpdateContext";
import UpdateOverlay from "./App/components/UpdateOverlay";

// Guards
import ScreenCaptureGuard from "./App/config/ScreenCaptureGuard";
import MaintenanceGuard from "./App/config/MaintenanceGuard";

// 🔥 lastSeen (THROTTLED)
import {
  updateLastSeenThrottled,
} from "./App/services/LastSeenService";

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

    // ❌ Licencia inválida o bloqueada
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

    // 📡 Offline vencido
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
// APP INNER (donde vive la lógica real)
// ==========================================================
function AppInner() {
  const navigationRef = useNavigationContainerRef();
  const [currentRouteName, setCurrentRouteName] = useState(null);
  const { licenseKey } = useLicense();

  // --------------------------------------------------------
  // 🔥 lastSeen al iniciar app
  // --------------------------------------------------------
  useEffect(() => {
    if (licenseKey) {
      updateLastSeenThrottled(licenseKey);
    }
  }, [licenseKey]);

  // --------------------------------------------------------
  // 🔥 lastSeen al volver del background
  // --------------------------------------------------------
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active" && licenseKey) {
        updateLastSeenThrottled(licenseKey);
      }
    });

    return () => sub.remove();
  }, [licenseKey]);

  // --------------------------------------------------------
  // 🔥 Heartbeat suave (intenta cada 1 min, escribe cada X)
  // --------------------------------------------------------
  useEffect(() => {
    if (!licenseKey) return;

    const interval = setInterval(() => {
      updateLastSeenThrottled(licenseKey);
    }, 60 * 1000); // intenta cada 1 minuto

    return () => clearInterval(interval);
  }, [licenseKey]);

  // --------------------------------------------------------
  // RENDER
  // --------------------------------------------------------
  return (
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
      {/* instructor provider */}
      <InstructorProvider />
      {/* 🔔 Banners de conectividad */}
      <OfflineLossBanner />
      <OfflineRecoveryBanner />

      {/* 🧭 Navegación principal */}
      <RootNavigator />

      {/* 🛡️ Guards globales (orden importa) */}
      <OfflineGuard navigationRef={navigationRef} />
      <MaintenanceGuard navigationRef={navigationRef} />

      {/* 🛡️ Seguridad */}
      <ScreenCaptureGuard
        currentRouteName={currentRouteName}
      />

      {/* ⬆️ Updates OTA */}
      <UpdateOverlay
        currentRouteName={currentRouteName}
      />
    </NavigationContainer>
  );
}

// ==========================================================
// APP ROOT (Providers)
// ==========================================================
export default function App() {
  return (
  <InstructorProvider>
    <LicenseProvider>
      <OfflineProvider>
        <UpdateProvider>
          <AppInner />
          <InstructorCard />
        </UpdateProvider>
      </OfflineProvider>
    </LicenseProvider>
  </InstructorProvider>   
  );
}
