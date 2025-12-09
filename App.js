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

// ⭐⭐ AÑADIR ESTO:
import { UpdateProvider } from "./App/updates/UpdateContext";
import UpdateOverlay from "./App/components/UpdateOverlay";
// ⭐⭐

function OfflineGuard({ navigationRef }) {
  const { isConnected, offlineLocked } = useOffline();
  const { licenseStatus } = useLicense();

  useEffect(() => {
    if (!navigationRef.current) return;
    const route = navigationRef.current.getCurrentRoute();
    const name = route?.name;

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
      return;
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
        {/* ⭐⭐ ENGLOBAR TODO EL NAVIGATION EN UpdateProvider ⭐⭐ */}
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

          {/* ⭐⭐ Overlay final ⭐⭐ */}
          <UpdateOverlay currentRouteName={currentRouteName} />
        </UpdateProvider>
      </OfflineProvider>
    </LicenseProvider>
  );
}
