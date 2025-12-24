// ==========================================================
// INSQUIZ — Root Navigator (Sistema Maestro)
// ==========================================================

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// System screens
import BootScreen from "../screens/BootScreen";
import MaintenanceScreen from "../screens/MaintenanceScreen";
import OfflineScreen from "../screens/OfflineScreen";
import LicenseScreen from "../screens/LicenseScreen";

// Main app
import DrawerRoot from "./DrawerRoot";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="BootScreen"
      screenOptions={{ headerShown: false }}
    >
      {/* 🟣 Arranque */}
      <Stack.Screen
        name="BootScreen"
        component={BootScreen}
      />

      {/* 🛠️ Mantenimiento global */}
      <Stack.Screen
        name="MaintenanceScreen"
        component={MaintenanceScreen}
      />

      {/* 📡 Offline */}
      <Stack.Screen
        name="OfflineScreen"
        component={OfflineScreen}
      />

      {/* 🔐 Licencia */}
      <Stack.Screen
        name="LicenseScreen"
        component={LicenseScreen}
      />

      {/* 🚀 App principal */}
      <Stack.Screen
        name="MainApp"
        component={DrawerRoot}
      />
    </Stack.Navigator>
  );
}
