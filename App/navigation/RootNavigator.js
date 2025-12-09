import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BootScreen from "../screens/BootScreen";
import LicenseScreen from "../screens/LicenseScreen";
import DrawerRoot from "./DrawerRoot";
import OfflineScreen from "../screens/OfflineScreen";
import { useLicense } from "../context/LicenseContext";
import CustomModeScreen from "../screens/CustomMode/CustomModeScreen";
import ResultScreen from "../screens/ResultScreen";
import ReviewScreen from "../screens/ReviewScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { licenseStatus } = useLicense();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>

      {/* 1️⃣ Siempre primero */}
      <Stack.Screen name="Boot" component={BootScreen} />

      {/* 2️⃣ Si la licencia NO es válida → SOLO LicenseScreen */}
      {licenseStatus === "invalid" || licenseStatus === "device_blocked" ? (
        <Stack.Screen name="LicenseScreen" component={LicenseScreen} />
      ) : null}

      {/* 3️⃣ Si la licencia es válida → habilitar la app */}
      {licenseStatus === "active" ? (
        <>
          <Stack.Screen name="MainApp" component={DrawerRoot} />

        <Stack.Screen name="CustomMode" component={CustomModeScreen} />

          <Stack.Screen name="OfflineScreen" component={OfflineScreen} />
              <Stack.Screen name="ResultScreen" component={ResultScreen} />
    <Stack.Screen name="ReviewScreen" component={ReviewScreen} />
        </>
      ) : null}

    </Stack.Navigator>
  );
}
