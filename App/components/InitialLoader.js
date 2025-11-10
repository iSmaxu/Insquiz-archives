// App/screens/InitialLoader.js
// ==========================================================
// INSQUIZ - InitialLoader (versión final sin navigation)
// ==========================================================
// - Carga bancos de preguntas (quizService)
// - Simula progreso visual
// - Al terminar, muestra LicenseGate directamente
// ==========================================================

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { preloadAllSubjects } from "../services/quizService";
import LicenseGate from "../components/LicenseGate";

export default function InitialLoader() {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Inicializando...");
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // ==========================================================
  // Animación inicial
  // ==========================================================
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, []);

  // ==========================================================
  // Proceso de carga
  // ==========================================================
  useEffect(() => {
    (async () => {
      try {
        setStatusText("Verificando recursos locales...");
        await AsyncStorage.getItem("license_key");
        await simulateProgress(0, 0.3);

        setStatusText("Preparando bancos de preguntas...");
        await preloadAllSubjects();
        await simulateProgress(0.3, 0.9);

        setStatusText("Optimizando caché...");
        await AsyncStorage.setItem("last_init", new Date().toISOString());
        await simulateProgress(0.9, 1);

        setStatusText("Completado ✔️");
        setReady(true);
      } catch (error) {
        console.warn("Error en InitialLoader:", error);
        setReady(true);
      }
    })();
  }, []);

  // ==========================================================
  // Simulación visual de progreso
  // ==========================================================
  async function simulateProgress(from, to) {
    const step = (to - from) / 20;
    for (let i = from; i <= to; i += step) {
      setProgress(i);
      await new Promise((r) => setTimeout(r, 40));
    }
  }

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 200,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start();
  }, [progress]);

  const widthInterpolated = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  // ==========================================================
  // Render
  // ==========================================================
  if (!ready) {
    return (
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Text style={styles.title}>InsQUIZ</Text>
        <Text style={styles.subtitle}>Entrena. Mejora. Supera el examen.</Text>

        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressBar, { width: widthInterpolated }]} />
        </View>

        <Text style={styles.statusText}>{statusText}</Text>

        <ActivityIndicator size="large" color="#6a0dad" style={{ marginTop: 20 }} />

        <Text style={styles.version}>v2.6.0 - Loader Estable</Text>
      </Animated.View>
    );
  }

  // ✅ Cuando termina la carga, muestra LicenseGate directamente
  return <LicenseGate />;
}

// ==========================================================
// ESTILOS
// ==========================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  title: {
    fontSize: 48,
    fontWeight: "900",
    color: "#6a0dad",
    marginBottom: 6,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 40,
  },
  progressContainer: {
    width: "100%",
    maxWidth: 320,
    height: 8,
    backgroundColor: "#e5e5e5",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#6a0dad",
    borderRadius: 4,
  },
  statusText: {
    marginTop: 12,
    fontSize: 15,
    color: "#444",
    textAlign: "center",
  },
  version: {
    position: "absolute",
    bottom: 20,
    fontSize: 12,
    color: "#999",
  },
});
