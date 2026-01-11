// ==========================================================
// INSQUIZ - Drawer Root (FINAL)
// ==========================================================

import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import { useLicense } from "../context/LicenseContext";

// ========================
// Screens
// ========================

// Core
import HomeScreen from "../screens/HomeScreen";
import PracticeMenuScreen from "../screens/PracticeMenuScreen";
import AdaptivePracticeScreen from "../screens/AdaptivePracticeScreen";
import ReviewScreen from "../screens/ReviewScreen";
import QuizScreen from "../screens/QuizScreen";
import ResultScreen from "../screens/ResultScreen";

// RealSim
import RealSimIntroScreen from "../screens/RealSimIntroScreen";
import RealSimExamScreen from "../screens/RealSimExamScreen";
import RealSimResultsScreen from "../screens/RealSimResultsScreen";

// User / Info
import AchievementsScreen from "../screens/AchievementsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import UserSettingsScreen from "../screens/UserSettingsScreen";
import AboutScreen from "../screens/AboutScreen";
import UAboutScreen from "../screens/UAboutScreen";
import CreditsScreen from "../screens/CreditsScreen";

// License
import LicenseScreen from "../screens/LicenseScreen";

// Dev / Support
import DevelopmentScreen from "../screens/DevelopmentScreen";
import DebugScreen from "../screens/DebugScreen";
import HomeScreenDebug from "../screens/HomeScreenDebug";
import TestQuestionScreen from "../screens/TestQuestionScreen";
import HelpModesScreen from "../screens/HelpModesScreen";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// ==========================================================
// Home Stack (flujo principal)
// ==========================================================

function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{ headerShown: false }}
    >
      {/* Home */}
      <Stack.Screen name="HomeScreen" component={HomeScreen} />

      {/* Practice */}
      <Stack.Screen name="PracticeMenuScreen" component={PracticeMenuScreen} />
      <Stack.Screen name="AdaptivePracticeScreen" component={AdaptivePracticeScreen} />
      <Stack.Screen name="ReviewScreen" component={ReviewScreen} />
      <Stack.Screen name="QuizScreen" component={QuizScreen} />
      <Stack.Screen name="ResultScreen" component={ResultScreen} />

      {/* RealSim */}
      <Stack.Screen name="RealSimIntro" component={RealSimIntroScreen} />
      <Stack.Screen name="RealSimExam" component={RealSimExamScreen} />
      <Stack.Screen name="RealSimResults" component={RealSimResultsScreen} />

      {/* License fallback */}
      <Stack.Screen name="LicenseScreen" component={LicenseScreen} />

      {/* Help / Support */}
      <Stack.Screen name="DevelopmentScreen" component={DevelopmentScreen} />
      <Stack.Screen name="HelpModes" component={HelpModesScreen} />
    </Stack.Navigator>
  );
}

// ==========================================================
// Settings Stack (CONFIGURACIÓN + DEBUG)
// ==========================================================

function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="UserSettings"
        component={UserSettingsScreen}
      />
      <Stack.Screen
        name="Debug"
        component={DebugScreen}
      />
    </Stack.Navigator>
  );
}

// ==========================================================
// Drawer Root
// ==========================================================

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
        drawerStyle: { backgroundColor: "#f6f0ff", width: 260 },
      }}
    >
      {/* HOME */}
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

      {/* DEBUG EXTRAS (solo licencia Dev) */}
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

      {isDebug && (
        <Drawer.Screen
          name="TestQuestion"
          component={TestQuestionScreen}
          options={{
            title: "🧪 Test de Preguntas",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="bug-outline" color={color} size={size} />
            ),
          }}
        />
      )}

      {/* INFO */}
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
        name="MoreAbout"
        component={UAboutScreen}
        options={{
          title: "📚 Más sobre INSQUIZ",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="book-outline" color={color} size={size} />
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
          title: "📈 Mi rendimiento",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" color={color} size={size} />
          ),
        }}
      />

      {/* SETTINGS (STACK) */}
      <Drawer.Screen
        name="Settings"
        component={SettingsStack}
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
