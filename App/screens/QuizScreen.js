// App/screens/QuizScreen.js
import React, { useContext, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  Vibration,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { QuizContext } from "../context/QuizContext";
import { answerMatchesMaster } from "../services/quizService";

export default function QuizScreen({ route, navigation }) {
  const { questionsBank, subjects, startQuiz, selectedQuiz } = useContext(QuizContext);
  const [index, setIndex] = useState(0);
  const [current, setCurrent] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showJustification, setShowJustification] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const subjectKey = route?.params?.subject || "lectura";

  useEffect(() => {
    const countParam = route?.params?.count;
    const defaultCount = subjectKey === "all" ? 50 : 10;
    const count = typeof countParam === "number" ? countParam : defaultCount;
    if (!selectedQuiz) startQuiz(subjectKey, count);
    // NOTE: startQuiz and selectedQuiz are stable from context; include to satisfy hooks rules
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startQuiz, route?.params?.count, subjectKey]);

  useEffect(() => {
    if (selectedQuiz && selectedQuiz.length > 0) {
      setCurrent(selectedQuiz[index]);
      setSelected(null);
      setShowResult(false);
      setShowJustification(false);
      anim.setValue(0);
    }
  }, [selectedQuiz, index]);

  if (!current) {
    return (
      <LinearGradient colors={["#4A148C", "#b40000"]} style={styles.container}>
        <Text style={styles.title}>Cargando preguntas...</Text>
      </LinearGradient>
    );
  }

  const handleSelect = (letter) => {
    if (!current) return;
    // Normalizar a letra mayúscula
    const chosen = (letter || "").toString().toUpperCase();
    setSelected(chosen);
    const correct = answerMatchesMaster(chosen, current.answer);
    setShowResult(true);
    setShowJustification(false);
    anim.setValue(0);

    if (!correct && Vibration && Vibration.vibrate) {
      // pequeña vibración para respuesta incorrecta
      try { Vibration.vibrate(50); } catch (e) { /* ignore */ }
    }

    Animated.timing(anim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: false,
    }).start(() => {
      // Al terminar la animación, mostramos la justificación y habilitamos Siguiente
      setShowJustification(true);
    });
  };

  const handleNext = () => {
    if (index + 1 < (selectedQuiz || []).length) {
      setIndex(index + 1);
    } else {
      navigation.navigate("Result");
    }
  };

  return (
    <LinearGradient colors={["#4A148C", "#6a0dad"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1, width: "100%" }}>
        <ScrollView contentContainerStyle={styles.inner}>
          {current.context_text ? (
            <View style={styles.contextBox}>
              <Text style={styles.contextTitle}>Contexto</Text>
              <Text style={styles.contextText}>{current.context_text}</Text>
            </View>
          ) : null}

          <View style={styles.card}>
            <Text style={styles.question}>{current.pregunta}</Text>

            {current.options && current.options.map((opt, i) => {
              const letter = String.fromCharCode(65 + i); // A, B, C
              const isSelected = selected === letter;
              const isCorrect = answerMatchesMaster(letter, current.answer);

              // Para la opción seleccionada usamos Animated background
              if (isSelected) {
                const bgColor = anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["#f7f7f7", isCorrect ? "#d4edda" : "#f8d7da"],
                });
                return (
                  <Animated.View key={i} style={[styles.option, isSelected ? styles.optionSelected : null, { backgroundColor: bgColor }]}>
                    <TouchableOpacity style={{ padding: 8 }} onPress={() => handleSelect(letter)}>
                      <Text style={styles.optionText}>{`${letter}) ${opt.replace(/^[A-D]\)\s*/i, "")}`}</Text>
                    </TouchableOpacity>
                  </Animated.View>
                );
              }

              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.option]}
                  onPress={() => handleSelect(letter)}
                >
                  <Text style={styles.optionText}>{`${letter}) ${opt.replace(/^[A-D]\)\s*/i, "")}`}</Text>
                </TouchableOpacity>
              );
            })}

            {showJustification && (
              <View style={styles.justificationBox}>
                <Text style={styles.justificationTitle}>Justificación</Text>
                <Text style={styles.justificationText}>{current.justification || current.justification?.toString?.() || ""}</Text>
              </View>
            )}

            {showJustification && (
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <Text style={styles.nextText}>Siguiente</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { alignItems: "center", padding: 20 },
  contextBox: { backgroundColor: "#fff", padding: 14, borderRadius: 12, marginBottom: 18, width: "100%" },
  contextTitle: { fontWeight: "700", marginBottom: 6 },
  contextText: { color: "#333" },
  card: { backgroundColor: "#fff", padding: 18, borderRadius: 14, width: "100%" },
  question: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  option: { padding: 12, borderRadius: 10, backgroundColor: "#f7f7f7", marginBottom: 10 },
  optionText: { color: "#222" },
  optionSelected: { borderColor: "#6a0dad", borderWidth: 2 },
  optionCorrect: { backgroundColor: "#d4edda" },
  nextButton: { marginTop: 12, backgroundColor: "#6a0dad", padding: 12, borderRadius: 10, alignItems: "center" },
  nextText: { color: "#fff", fontWeight: "700" },
  justificationBox: { marginTop: 12, backgroundColor: "#fff", padding: 12, borderRadius: 8 },
  justificationTitle: { fontWeight: "700", marginBottom: 6 },
  justificationText: { color: "#333" },
  title: { color: "#fff", textAlign: "center", marginTop: 40 }
});
