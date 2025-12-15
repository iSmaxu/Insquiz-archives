// App.js
import React, { useEffect, useState } from "react";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";

import RootNavigator from "./App/navigation/RootNavigator";
import { LicenseProvider, useLicense } from "./App/context/LicenseContext";
import { OfflineProvider, useOffline } from "./App/context/OfflineContext";
import OfflineLossBanner from "./App/components/OfflineLossBanner";

// Updates
import { UpdateProvider } from "./App/updates/UpdateContext";
import UpdateOverlay from "./App/components/UpdateOverlay";

// ==========================================================
// 🚫 NOTIFICACIONES COMPLETAMENTE DESACTIVADAS
// (no OneSignal, no Expo Notifications, no listeners)
// ==========================================================

function OfflineGuard({ navigationRef }) {
  const { isConnected, offlineLocked } = useOffline();
  const { licenseStatus } = useLicense();

  useEffect(() => {
    if (!navigationRef.current) return;
    const name = navigationRef.current.getCurrentRoute()?.name;

    if (licenseStatus === "invalid" || licenseStatus === "device_blocked") {
      if (name !== "LicenseScreen") {
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: "LicenseScreen" }],
        });
      }
      return;
    }

    if (offlineLocked && name !== "OfflineScreen") {
      navigationRef.current.reset({
        index: 0,
        routes: [{ name: "OfflineScreen" }],
      });
      return;
    }

    if (!isConnected && licenseStatus === "active" && name !== "OfflineScreen") {
      navigationRef.current.reset({
        index: 0,
        routes: [{ name: "OfflineScreen" }],
      });
    }
  }, [licenseStatus, isConnected, offlineLocked]);

  return null;
}

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
              const route = navigationRef.current.getCurrentRoute();
              setCurrentRouteName(route?.name);
            }}
            onStateChange={() => {
              const route = navigationRef.current.getCurrentRoute();
              setCurrentRouteName(route?.name);
            }}
          >
            <OfflineLossBanner />
            <RootNavigator />
            <OfflineGuard navigationRef={navigationRef} />
          </NavigationContainer>

          <UpdateOverlay currentRouteName={currentRouteName} />
        </UpdateProvider>
      </OfflineProvider>
    </LicenseProvider>
  );
}
