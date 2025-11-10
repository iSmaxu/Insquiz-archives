// App.js
// ==========================================================
// INSQUIZ - App.js (estructura corregida y precarga completa)
// ==========================================================
// Incluye:
//  ✅ Imports reales según tu estructura (/App/ y /components/)
//  ✅ Drawer + Stack navegadores funcionando
//  ✅ Precarga de quizService + textService
// ==========================================================

import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider } from "react-native-paper";

import { QuizProvider } from "./App/context/QuizContext";

// 🧩 Componentes y pantallas
import LicenseGate from "./App/components/LicenseGate";
import HomeScreen from "./App/screens/HomeScreen";
import QuizScreen from "./App/screens/QuizScreen";
import RealSimScreen from "./App/screens/RealSimScreen";
import AchievementsScreen from "./App/screens/AchievementsScreen";
import UserSettingsScreen from "./App/screens/UserSettingsScreen";
import PracticeMenuScreen from "./App/screens/PracticeMenuScreen";

// ⚙️ Servicios
import { preloadQuestions } from "./App/services/quizService";
import { preloadTexts } from "./App/services/textService";

// 🔕 Ignorar advertencias no críticas
LogBox.ignoreLogs([
  "AsyncStorage has been extracted",
  "Non-serializable values were found",
]);

// ==========================================================
// Navegadores base
// ==========================================================
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// ==========================================================
// Drawer principal (menú lateral de Home)
// ==========================================================
function DrawerRoot() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        drawerType: "slide",
        drawerStyle: { backgroundColor: "#f5f0ff", width: 250 },
        headerStyle: { backgroundColor: "#6a0dad" },
        headerTintColor: "#fff",
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "🏠 Inicio" }}
      />
      <Drawer.Screen
        name="Achievements"
        component={AchievementsScreen}
        options={{ title: "🏅 Logros" }}
      />
      <Drawer.Screen
        name="Settings"
        component={UserSettingsScreen}
        options={{ title: "⚙️ Configuración" }}
      />
    </Drawer.Navigator>
  );
}

// ==========================================================
// APP principal con precarga y LicenseGate
// ==========================================================
export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const preloadAll = async () => {
      try {
        console.log("⏳ Iniciando precarga global...");
        await preloadQuestions();
        await preloadTexts();
        console.log("✅ Precarga completada correctamente");
      } catch (err) {
        console.error("❌ Error durante la precarga:", err);
      } finally {
        setIsReady(true);
      }
    };
    preloadAll();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6a0dad" />
        <Text style={styles.loadingText}>Preparando InsQUIZ...</Text>
      </View>
    );
  }

  return (
    <PaperProvider>
      <QuizProvider>
        <NavigationContainer>
          {/* LicenseGate ahora en /components/ */}
          <LicenseGate>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="DrawerRoot" component={DrawerRoot} />
              <Stack.Screen name="QuizScreen" component={QuizScreen} />
              <Stack.Screen name="RealSimScreen" component={RealSimScreen} />
              <Stack.Screen name="PracticeMenuScreen" component={PracticeMenuScreen} />
            </Stack.Navigator>
          </LicenseGate>
        </NavigationContainer>
      </QuizProvider>
    </PaperProvider>
  );
}

// ==========================================================
// 🎨 Estilos
// ==========================================================
const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: "#fafafa",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#6a0dad",
    fontSize: 16,
    marginTop: 12,
    fontWeight: "bold",
  },
});
