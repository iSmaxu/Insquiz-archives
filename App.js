// App.js
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import { QuizProvider } from "./App/context/QuizContext";
import DrawerRoot from "./App/navigation/DrawerRoot";
import LicenseGate from "./App/components/LicenseGate";
import { preloadQuestions } from "./App/services/quizService";
import { RealSimScreen } from "./App/screens/RealSimScreen";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await preloadQuestions();
      } catch (e) {
        console.warn("Precarga fallida:", e);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6a0dad" />
        <Text style={styles.text}>Preparando InsQUIZ...</Text>
      </View>
    );
  }

  return (
    <PaperProvider>
      <QuizProvider>
        <NavigationContainer>
          <LicenseGate>
            <DrawerRoot />
          </LicenseGate>
        </NavigationContainer>
      </QuizProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  text: { color: "#6a0dad", fontWeight: "bold", marginTop: 10 },
});
