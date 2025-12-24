// ==========================================================
// INSQUIZ - Drawer Root
// ==========================================================

import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import { useLicense } from "../context/LicenseContext";

// Pantallas base
import HomeScreen from "../screens/HomeScreen";
import CreditsScreen from "../screens/CreditsScreen";
import PracticeMenuScreen from "../screens/PracticeMenuScreen";
import AdaptivePracticeScreen from "../screens/AdaptivePracticeScreen";
import QuizScreen from "../screens/QuizScreen";
import ResultScreen from "../screens/ResultScreen";
import AchievementsScreen from "../screens/AchievementsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import UserSettingsScreen from "../screens/UserSettingsScreen";
import LicenseScreen from "../screens/LicenseScreen";
import HomeScreenDebug from "../screens/HomeScreenDebug";
import AboutScreen from "../screens/AboutScreen";

// RealSim NUEVO
import RealSimIntroScreen from "../screens/RealSimIntroScreen";
import RealSimExamScreen from "../screens/RealSimExamScreen";
import RealSimResultsScreen from "../screens/RealSimResultsScreen";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />

      {/* práctica */}
      <Stack.Screen name="PracticeMenuScreen" component={PracticeMenuScreen} />
      <Stack.Screen name="AdaptivePracticeScreen" component={AdaptivePracticeScreen} />
      <Stack.Screen name="QuizScreen" component={QuizScreen} />
      <Stack.Screen name="ResultScreen" component={ResultScreen} />

      {/* licencia */}
      <Stack.Screen name="LicenseScreen" component={LicenseScreen} />

      {/* RealSim NUEVO */}
      <Stack.Screen name="RealSimIntro" component={RealSimIntroScreen} />
      <Stack.Screen name="RealSimExam" component={RealSimExamScreen} />
      <Stack.Screen name="RealSimResults" component={RealSimResultsScreen} />
    </Stack.Navigator>
  );
}

export default function DrawerRoot() {
  const { licenseKey } = useLicense();
  const isDebug = licenseKey === "Dev";

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

      {isDebug && (
        <Drawer.Screen
          name="HomeDebug"
          component={HomeScreenDebug}
          options={{
            title: "🐞 Debug Inicio",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="bug-outline" color={color} size={size} />
            ),
          }}
        />
      )}

      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: "ℹ️ Acerca de",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" color={color} size={size} />
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
        name="Credits"
        component={CreditsScreen}
        options={{
          title: "📜 Créditos",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
