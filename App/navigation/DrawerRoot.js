// App/navigation/DrawerRoot.js
// ==========================================================
// INSQUIZ - DrawerRoot (Navegador lateral principal)
// ==========================================================

import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

// 🧩 Pantallas
import HomeScreen from "../screens/HomeScreen";
import PracticeMenuScreen from "../screens/PracticeMenuScreen";
import AdaptivePracticeScreen from "../screens/AdaptivePracticeScreen";
import QuizScreen from "../screens/QuizScreen";
import RealSimScreen from "../screens/RealSimScreen";
import RealSimReviewScreen from "../screens/RealSimReviewScreen";
import ResultScreen from "../screens/ResultScreen";
import AchievementsScreen from "../screens/AchievementsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import UserSettingsScreen from "../screens/UserSettingsScreen";
import LicenseScreen from "../screens/LicenseScreen";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// ==========================================================
// STACK PRINCIPAL
// ==========================================================
function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="PracticeMenuScreen" component={PracticeMenuScreen} />
      <Stack.Screen name="AdaptivePracticeScreen" component={AdaptivePracticeScreen} />
      <Stack.Screen name="QuizScreen" component={QuizScreen} />
      <Stack.Screen name="RealSimScreen" component={RealSimScreen} />
      <Stack.Screen name="RealSimReviewScreen" component={RealSimReviewScreen} />
      <Stack.Screen name="ResultScreen" component={ResultScreen} />
    </Stack.Navigator>
  );
}

// ==========================================================
// DRAWER
// ==========================================================
export default function DrawerRoot() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#6a0dad" },
        headerTintColor: "#fff",
        drawerActiveTintColor: "#6a0dad",
        drawerStyle: { backgroundColor: "#f6f0ff", width: 250 },
      }}
    >
      {/* 🔥 IMPORTANTE: AQUÍ EL NOMBRE DEBE SER "Home" */}
      <Drawer.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: "🏠 Inicio",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="Achievements"
        component={AchievementsScreen}
        options={{
          title: "🏅 Logros",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="trophy-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "📈 Mi Rendimiento",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="Settings"
        component={UserSettingsScreen}
        options={{
          title: "⚙️ Configuración",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name="License"
        component={LicenseScreen}
        options={{
          title: "🔑 Licencia",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="key-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
