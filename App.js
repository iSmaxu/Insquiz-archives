import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";

import { QuizProvider } from "./App/context/QuizContext";
import RootNavigator from "./App/navigation/RootNavigator";



export default function App() {
  return (
    <PaperProvider>
      <QuizProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </QuizProvider>
    </PaperProvider>
  );
}
