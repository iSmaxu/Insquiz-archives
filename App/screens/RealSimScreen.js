import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { ProgressBar } from "react-native-paper";
import QuestionCard from "../components/QuestionCard";
import { saveProgress } from "../services/statsService";
import { getQuestions } from "../services/quizService";
import {
  saveSimulacroProgress,
  getSimulacroProgress,
  clearSimulacroProgress,
} from "../services/realSimProgressService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RealSimScreen({ navigation }) {
  const [preguntas, setPreguntas] = useState([]);
  const [current, setCurrent] = useState(0);
  const [remainingTime, setRemainingTime] = useState(150);
  const [finished, setFinished] = useState(false);
  const [puntaje, setPuntaje] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    (async () => {
      const saved = await getSimulacroProgress();
      if (saved && saved.preguntas?.length) {
        Alert.alert(
          "Continuar simulacro",
          "Tienes un simulacro guardado. ¿Deseas continuar desde donde lo dejaste?",
          [
            { text: "No", style: "cancel", onPress: () => cargarPreguntas() },
            { text: "Sí", onPress: () => restaurarSimulacro(saved) },
          ]
        );
      } else {
        cargarPreguntas();
      }
    })();
  }, []);

  async function cargarPreguntas() {
    try {
      const all = await getQuestions("real");
      const formatted = all.map((q) => ({
        ...q,
        userAnswer: null,
        isCorrect: false,
      }));
      setPreguntas(formatted);
      setLoaded(true);
    } catch (e) {
      console.error("Error cargando preguntas:", e);
    }
  }

  function restaurarSimulacro(saved) {
    setPreguntas(saved.preguntas);
    setCurrent(saved.current);
    setRemainingTime(saved.remainingTime);
    setFinished(saved.finished);
    setPuntaje(saved.puntaje);
    setLoaded(true);
  }

  useEffect(() => {
    if (!preguntas.length || finished) return;
    timerRef.current = setInterval(() => {
      setRemainingTime((t) => {
        if (t <= 1) {
          handleNext(false);
          return 150;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [current, preguntas, finished]);

  // Auto guardado cada 10 s
  useEffect(() => {
    if (!preguntas.length || finished) return;
    const autosave = setInterval(() => {
      saveSimulacroProgress({ preguntas, current, remainingTime, finished, puntaje });
    }, 10000);
    return () => clearInterval(autosave);
  }, [preguntas, current, remainingTime, finished, puntaje]);

  async function handleNext(respondida = true, correcta = false, skill = null, userAnswer = null) {
    clearInterval(timerRef.current);
    setRemainingTime(150);

    if (respondida && skill) {
      await saveProgress(skill, correcta);
    }

    // Guarda la respuesta del usuario en la pregunta actual
    const updated = [...preguntas];
    updated[current] = {
      ...updated[current],
      userAnswer,
      isCorrect: correcta,
    };
    setPreguntas(updated);

    if (current + 1 < preguntas.length) {
      setCurrent(current + 1);
    } else {
      await finalizarSimulacro(updated);
    }
  }

  async function finalizarSimulacro(preguntasFinales) {
    setFinished(true);
    clearInterval(timerRef.current);
    await clearSimulacroProgress();

    // Guardar para revisión
    await AsyncStorage.setItem("simulacroReview", JSON.stringify(preguntasFinales));

    const correctas = preguntasFinales.filter((q) => q.isCorrect).length;
    const total = preguntasFinales.length;
    const porcentaje = total ? correctas / total : 0;
    const score = Math.round(300 + (porcentaje - 0.5) * 400);
    setPuntaje(Math.max(0, Math.min(score, 500)));
  }

  if (!loaded) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Cargando simulacro...</Text>
      </View>
    );
  }

  if (finished) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>🎯 Simulacro finalizado</Text>
        <Text style={styles.result}>
          Puntaje estimado: <Text style={styles.highlight}>{puntaje}/500</Text>
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#6a0dad" }]}
          onPress={() => navigation.navigate("RealSimReview")}
        >
          <Text style={styles.buttonText}>Ver revisión detallada</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQuestion = preguntas[current];
  const progreso = (current + 1) / preguntas.length;
  const minutos = Math.floor(remainingTime / 60);
  const segundos = (remainingTime % 60).toString().padStart(2, "0");

  return (
    <View style={styles.container}>
      <View style={styles.timerBox}>
        <Text style={styles.timerText}>⏱️ {minutos}:{segundos}</Text>
        <ProgressBar
          progress={remainingTime / 150}
          color={remainingTime < 20 ? "#e53935" : "#6a0dad"}
          style={{ height: 6, borderRadius: 8 }}
        />
      </View>

      <QuestionCard
        question={currentQuestion}
        index={current}
        total={preguntas.length}
        bankStatus="online"
        onNext={(isCorrect, selected) =>
          handleNext(true, isCorrect, currentQuestion.skill || "General", selected)
        }
      />

      <View style={styles.footer}>
        <Text style={styles.progress}>
          Pregunta {current + 1} / {preguntas.length}
        </Text>
        <ProgressBar
          progress={progreso}
          color="#6a0dad"
          style={{ height: 8, borderRadius: 8 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", color: "#6a0dad", marginBottom: 10 },
  result: { fontSize: 18, color: "#333", textAlign: "center", marginBottom: 15 },
  highlight: { color: "#6a0dad", fontWeight: "bold" },
  timerBox: { marginBottom: 10, alignItems: "center" },
  timerText: { fontSize: 18, color: "#333", fontWeight: "bold" },
  footer: { marginTop: 10 },
  progress: { textAlign: "center", marginTop: 6, color: "#444" },
  button: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
