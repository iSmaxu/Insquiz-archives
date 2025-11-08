// App.js
import React, { memo } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

// Providers y Gates
import { QuizProvider } from "./App/context/QuizContext";
import LicenseGate from "./App/components/LicenseGate";

// Screens
import HomeScreen from "./App/screens/HomeScreen";
import QuizScreen from "./App/screens/QuizScreen";
import RealSimScreen from "./App/screens/RealSimScreen";
import ResultScreen from "./App/screens/ResultScreen";
import AchievementsScreen from "./App/screens/AchievementsScreen";
import PracticeMenuScreen from "./App/screens/PracticeMenuScreen";
import LicenseScreen from "./App/screens/LicenseScreen";
import UserSettingsScreen from "./App/screens/UserSettingsScreen";

/** @type {import('@react-navigation/drawer').DrawerNavigator} */
const Drawer = createDrawerNavigator();
/** @type {import('@react-navigation/stack').StackNavigator} */
const Stack = createStackNavigator();
/** @type {import('@react-navigation/stack').StackNavigator} */
const HomeStackNav = createStackNavigator();

// Constantes de navegación
const ROUTES = {
  DRAWER_ROOT: "DrawerRoot",
  HOME_STACK: "HomeStack",
  HOME_MAIN: "HomeMain",
  PRACTICE_MENU: "PracticeMenu",
  HomeScreen: "Home",
  REAL_SIM: "RealSim",
  QUIZ: "Quiz",
  RESULT: "Result",
  LICENSE: "License",
  ACHIEVEMENTS: "Achievements",
  USER_SETTINGS: "UserSettings"
};

// Opciones compartidas de navegación
const defaultScreenOptions = {
  headerShown: false
};

// Stack para Home y sus subpantallas
const HomeStack = memo(function HomeStack() {
  return (
    <HomeStackNav.Navigator screenOptions={defaultScreenOptions}>
      <HomeStackNav.Screen name={ROUTES.HOME_MAIN} component={HomeScreen} />
      <HomeStackNav.Screen name={ROUTES.PRACTICE_MENU} component={PracticeMenuScreen} />
      <HomeStackNav.Screen name={ROUTES.REAL_SIM} component={RealSimScreen} />
    </HomeStackNav.Navigator>
  );
});

// Opciones del Drawer
const drawerScreenOptions = {
  headerShown: false,
  drawerActiveTintColor: "#6a0dad",
  drawerInactiveTintColor: "#555",
  drawerLabelStyle: { fontWeight: "600" },
};

// Drawer Navigator Principal
const DrawerRoot = memo(function DrawerRoot() {
  return (
    <Drawer.Navigator
      initialRouteName={ROUTES.HOME_STACK}
      screenOptions={drawerScreenOptions}
    >
      <Drawer.Screen
        name={ROUTES.HOME_STACK}
        component={HomeStack}
        options={{
          title: "Inicio",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      
      <Drawer.Screen
        name={ROUTES.ACHIEVEMENTS}
        component={AchievementsScreen}
        options={{
          title: "Logros",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="trophy-outline" color={color} size={size} />
          ),
        }}
      />

      <Drawer.Screen
        name={ROUTES.USER_SETTINGS}
        component={UserSettingsScreen}
        options={{
          title: "Configuración",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
});

// Root Stack Navigator
const RootStack = memo(function RootStack() {
  return (
    <Stack.Navigator screenOptions={defaultScreenOptions}>
      <Stack.Screen name={ROUTES.HomeScreen} component={HomeScreen} />
      <Stack.Screen name={ROUTES.DRAWER_ROOT} component={DrawerRoot} />
      <Stack.Screen 
        name={ROUTES.QUIZ}
        component={QuizScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen 
        name={ROUTES.RESULT}
        component={ResultScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name={ROUTES.LICENSE} component={LicenseScreen} />
    </Stack.Navigator>
  );
});

// App Principal
export default function App() {
  return (
    <QuizProvider>
      <PaperProvider>
        <NavigationContainer>
          <LicenseGate>
            <RootStack />
          </LicenseGate>
        </NavigationContainer>
      </PaperProvider>
    </QuizProvider>
  );
}
