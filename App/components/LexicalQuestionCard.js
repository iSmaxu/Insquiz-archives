// ===========================================================
// INSQUIZ — LEXICAL MATCHING QUESTION CARD (UX FEEDBACK)
// ===========================================================

import React, { useState, useMemo, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Vibration,
} from "react-native";
import { saveHistory } from "../engines/HistoryEngine";

export default function LexicalQuestionCard({
  question,
  index = 0,
  total = 1,
  onNext,
}) {
  if (!question || !Array.isArray(question.items)) return null;

  const hasNext = typeof onNext === "function";

  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [reviewMode, setReviewMode] = useState(false);
  const [error, setError] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const activeItem = question.items[activeIndex];

  const definitions = useMemo(() => {
    return [...question.items]
      .map((i) => i.definition)
      .sort(() => Math.random() - 0.5);
  }, [question.id]);

  const totalItems = question.items.length;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === totalItems;

  function triggerErrorFeedback() {
    // 📳 vibración corta
    Vibration.vibrate(80);

    // 🔁 animación shake
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -8,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function selectDefinition(def) {
    setAnswers((a) => ({
      ...a,
      [activeItem.word]: def,
    }));
    setError(false);
  }

  function allCorrect() {
    return question.items.every(
      (i) => answers[i.word] === i.definition
    );
  }

  async function finishQuestion() {
    if (!hasNext) return;
    await saveHistory(question.id);
    onNext({ letter: allCorrect() ? "A" : "B" });
  }

  // ======================================================
  // 🔍 MODO REVISIÓN
  // ======================================================
  if (reviewMode) {
    return (
      <View style={styles.card}>
        <Text style={styles.question}>Revisión de respuestas</Text>

        {question.items.map((item, i) => {
          const userDef = answers[item.word];
          const isCorrect = userDef === item.definition;

          return (
            <View
              key={i}
              style={[
                styles.reviewRow,
                isCorrect
                  ? styles.reviewCorrect
                  : styles.reviewWrong,
              ]}
            >
              <Text style={styles.reviewWord}>{item.word}</Text>
              <Text style={styles.reviewUser}>
                Tu respuesta: {userDef || "—"}
              </Text>
              {!isCorrect && (
                <Text style={styles.reviewCorrectDef}>
                  Correcta: {item.definition}
                </Text>
              )}
            </View>
          );
        })}

        {question.justification && (
          <View style={styles.justificationBox}>
            <Text style={styles.justTitle}>Justificación:</Text>
            <Text style={styles.justText}>{question.justification}</Text>
          </View>
        )}

        {hasNext && (
          <TouchableOpacity style={styles.nextBtn} onPress={finishQuestion}>
            <Text style={styles.nextText}>
              {index + 1 === total ? "Finalizar" : "Siguiente"}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.bottomSpacer} />
      </View>
    );
  }

  // ======================================================
  // ✏️ MODO RESOLUCIÓN
  // ======================================================
  return (
    <View style={styles.card}>
      <Text style={styles.question}>
        Relaciona cada palabra con su definición:
      </Text>

      {/* 🔁 BOTONERA SUPERIOR (ANIMADA) */}
      <Animated.View
        style={[
          styles.navRow,
          { transform: [{ translateX: shakeAnim }] },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.navBtn,
            activeIndex === 0 && styles.navDisabled,
          ]}
          disabled={activeIndex === 0}
          onPress={() => setActiveIndex((i) => i - 1)}
        >
          <Text style={styles.navText}>← Atrás</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navBtn}>
          <Text style={styles.navText}>
            Marcadas {answeredCount}/{totalItems}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navBtn,
            activeIndex === totalItems - 1 && styles.navDisabled,
          ]}
          disabled={activeIndex === totalItems - 1}
          onPress={() => setActiveIndex((i) => i + 1)}
        >
          <Text style={styles.navText}>Adelante →</Text>
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.word}>{activeItem.word}</Text>

      {definitions.map((def, i) => {
        const selected = answers[activeItem.word] === def;

        return (
          <TouchableOpacity
            key={i}
            style={[
              styles.matchOption,
              selected && styles.matchSelected,
            ]}
            onPress={() => selectDefinition(def)}
          >
            <Text style={styles.matchText}>{def}</Text>
          </TouchableOpacity>
        );
      })}

      {/* 🚫 RESPONDER */}
      <TouchableOpacity
        style={[
          styles.answerBtn,
          !allAnswered && { opacity: 0.4 },
        ]}
        onPress={() => {
          if (!allAnswered) {
            setError(true);
            triggerErrorFeedback();
            return;
          }
          setReviewMode(true);
        }}
      >
        <Text style={styles.answerBtnText}>Responder</Text>
      </TouchableOpacity>

      {error && (
        <Text style={styles.errorText}>
          Debes relacionar todas las palabras antes de continuar.
        </Text>
      )}

      <View style={styles.bottomSpacer} />
    </View>
  );
}

/* ======================================================
   🎨 STYLES (SIN CAMBIOS VISUALES)
   ====================================================== */

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 3,
  },

  question: { fontSize: 17, fontWeight: "800", marginBottom: 16 },
  word: { fontSize: 18, fontWeight: "900", color: "#6a0dad", marginBottom: 14 },

  matchOption: {
    backgroundColor: "#f2f2f2",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },
  matchSelected: {
    backgroundColor: "#ede9ff",
    borderColor: "#6a0dad",
    borderWidth: 2,
  },
  matchText: { fontSize: 15 },

  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  navBtn: {
    backgroundColor: "#e0e0e0",
    padding: 8,
    borderRadius: 12,
  },
  navDisabled: { opacity: 0.4 },
  navText: { fontWeight: "700", fontSize: 13 },

  answerBtn: {
    backgroundColor: "#6a0dad",
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 10,
  },
  answerBtnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },

  nextBtn: {
    marginTop: 16,
    backgroundColor: "#6a0dad",
    paddingVertical: 12,
    borderRadius: 14,
  },
  nextText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },

  reviewRow: { padding: 12, borderRadius: 12, marginBottom: 10 },
  reviewCorrect: { backgroundColor: "#e6f7ea" },
  reviewWrong: { backgroundColor: "#fdecea" },
  reviewWord: { fontWeight: "800" },
  reviewUser: { fontSize: 14 },
  reviewCorrectDef: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2e7d32",
  },

  justificationBox: {
    marginTop: 16,
    backgroundColor: "#f3e8ff",
    padding: 12,
    borderRadius: 12,
  },
  justTitle: { fontWeight: "800", color: "#6a0dad" },
  justText: { fontSize: 14 },

  errorText: {
    marginTop: 8,
    color: "#c62828",
    fontWeight: "700",
    textAlign: "center",
  },

  bottomSpacer: { height: 70 },
});
