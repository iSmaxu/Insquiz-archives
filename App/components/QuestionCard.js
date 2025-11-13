// App/components/QuestionCard.js
// ==========================================================
//  INSQUIZ - QuestionCard (usa context_text interno)
// ==========================================================

import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Vibration, Animated } from "react-native";

const NEXT_DELAY_MS = 250;

export default function QuestionCard({
  question,
  questionIndex,
  totalQuestions,
  onAnswer,       // (isCorrect, selectedOption) => void
  onNext,         // se llama cuando se pulsa el botón "Siguiente"
}) {
  const [selected, setSelected] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showNext, setShowNext] = useState(false);

  const nextTimer = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Resetear estado cuando cambia la pregunta
    setSelected(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setShowNext(false);
    fadeAnim.setValue(0);
    if (nextTimer.current) {
      clearTimeout(nextTimer.current);
    }
  }, [question?.id]);

  useEffect(() => {
    if (showNext) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [showNext]);

  const handleOptionPress = (opt) => {
    if (isAnswered) return;

    const correct = question.answer?.trim?.() === opt.trim?.();
    setSelected(opt);
    setIsAnswered(true);
    setIsCorrect(correct);

    if (!correct) {
      // Vibración fuerte al fallo
      Vibration.vibrate([0, 200, 100, 200]);
    }

    // Avisamos al padre
    onAnswer?.(correct, opt);

    // Mostrar botón "Siguiente" después de 250 ms
    nextTimer.current = setTimeout(() => setShowNext(true), NEXT_DELAY_MS);
  };

  const getOptionStyle = (opt) => {
    if (!isAnswered) return styles.option;

    const correctOpt = question.answer?.trim?.();
    const isSelectedOpt = selected === opt;
    const isCorrectOpt = correctOpt === opt;

    // Correcta seleccionada → verde
    if (isSelectedOpt && isCorrectOpt) {
      return [styles.option, styles.optionCorrect];
    }

    // Incorrecta seleccionada → roja
    if (isSelectedOpt && !isCorrectOpt) {
      return [styles.option, styles.optionIncorrect];
    }

    // Correcta (aunque no haya sido seleccionada) → verde tenue
    if (!isSelectedOpt && isCorrectOpt) {
      return [styles.option, styles.optionCorrectSoft];
    }

    return styles.option;
  };

  const getQuestionWrapperStyle = () => {
    if (!isAnswered) return styles.questionWrapper;
    if (isCorrect) return [styles.questionWrapper, styles.questionWrapperCorrect];
    return [styles.questionWrapper, styles.questionWrapperIncorrect];
  };

  return (
    <View style={styles.container}>
      {/* Índice / Progreso */}
      <Text style={styles.counter}>
        Pregunta {questionIndex + 1} de {totalQuestions}
      </Text>

      {/* Contexto (si existe) */}
      {question.context_text ? (
        <View style={styles.contextBox}>
          <Text style={styles.contextTitle}>Texto</Text>
          <Text style={styles.contextText}>{question.context_text}</Text>
        </View>
      ) : null}

      {/* Pregunta */}
      <View style={getQuestionWrapperStyle()}>
        <Text style={styles.questionText}>{question.question}</Text>
      </View>

      {/* Opciones */}
      <View style={styles.optionsContainer}>
        {question.options?.map((opt, idx) => (
          <TouchableOpacity
            key={`${question.id}-opt-${idx}`}
            style={getOptionStyle(opt)}
            onPress={() => handleOptionPress(opt)}
            activeOpacity={0.8}
          >
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Justificación (solo cuando ya respondió) */}
      {isAnswered && question.justification ? (
        <View style={styles.justificationBox}>
          <Text style={styles.justificationTitle}>Justificación</Text>
          <Text style={styles.justificationText}>{question.justification}</Text>
        </View>
      ) : null}

      {/* Botón siguiente con fade-in */}
      {showNext && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity style={styles.nextButton} onPress={onNext} activeOpacity={0.85}>
            <Text style={styles.nextButtonText}>Siguiente</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  counter: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 8,
  },
  contextBox: {
    backgroundColor: "#1c1c1e",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  contextTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffb74d",
    marginBottom: 4,
  },
  contextText: {
    fontSize: 14,
    color: "#e0e0e0",
  },
  questionWrapper: {
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  questionWrapperCorrect: {
    borderColor: "#4caf50",
  },
  questionWrapperIncorrect: {
    borderColor: "#f44336",
  },
  questionText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
  optionsContainer: {
    marginTop: 4,
    marginBottom: 8,
  },
  option: {
    backgroundColor: "#333",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  optionCorrect: {
    backgroundColor: "#1b5e20",
    borderColor: "#4caf50",
  },
  optionCorrectSoft: {
    backgroundColor: "#1b5e2033",
    borderColor: "#4caf50aa",
  },
  optionIncorrect: {
    backgroundColor: "#5d1c1c",
    borderColor: "#f44336",
  },
  optionText: {
    color: "#fff",
    fontSize: 15,
  },
  justificationBox: {
    backgroundColor: "#111",
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#444",
  },
  justificationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffb74d",
    marginBottom: 4,
  },
  justificationText: {
    fontSize: 14,
    color: "#ddd",
  },
  nextButton: {
    marginTop: 12,
    backgroundColor: "#1976d2",
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
