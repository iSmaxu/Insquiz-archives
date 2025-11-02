import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import LicenseGate from "./App/components/LicenseGate";
import { QuizProvider } from "./App/context/QuizContext";

import HomeScreen from "./App/screens/HomeScreen";
import QuizScreen from "./App/screens/QuizScreen";
import RealSimScreen from "./App/screens/RealSimScreen";
import RealSimReviewScreen from "./App/screens/RealSimReviewScreen";
import AchievementsScreen from "./App/screens/AchievementsScreen";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#6a0dad" },
        headerTintColor: "#fff",
        drawerActiveTintColor: "#6a0dad",
        drawerInactiveTintColor: "#555",
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Inicio",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Achievements"
        component={AchievementsScreen}
        options={{
          title: "Logros",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="trophy-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <LicenseGate>
      <QuizProvider>
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Root" component={DrawerNavigator} />
              <Stack.Screen name="Quiz" component={QuizScreen} />
              <Stack.Screen name="RealSim" component={RealSimScreen} />
              <Stack.Screen name="RealSimReview" component={RealSimReviewScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </QuizProvider>
    </LicenseGate>
  );
}
