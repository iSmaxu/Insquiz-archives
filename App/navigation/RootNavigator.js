import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import BootScreen from "../screens/BootScreen";
import DrawerRoot from "./DrawerRoot";

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="BootScreen" screenOptions={{ headerShown: false }}>
      
      {/* 1️⃣ Pantalla inicial de carga */}
      <Stack.Screen name="BootScreen" component={BootScreen} />

      {/* 2️⃣ La app completa (Drawer + Stacks) */}
      <Stack.Screen name="MainApp" component={DrawerRoot} />
    </Stack.Navigator>
  );
}
