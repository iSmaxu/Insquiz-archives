// App/components/QuestionCard.js
// ===========================================================
// INSQUIZ — QUESTION CARD robusto con historial anti-repetición
// Guarda también la respuesta del usuario
// ===========================================================

import React, { useState, useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// IMPORTANTE: historial
import { saveHistory } from "../engines/HistoryEngine";

export default function QuestionCard({
  question,
  index,
  total,
  onNext,
}) {
  if (!question || !question.options) return null;

  const options = useMemo(() => {
    return question.options.map((op, i) => {
      if (typeof op === "string") {
        const match = op.match(/^([A-D])\)\s*(.*)$/i);
        if (match) {
          return { letter: match[1].toUpperCase(), text: match[2].trim() };
        }
        return { letter: String.fromCharCode(65 + i), text: op };
      }
      if (op?.letter && op?.text) {
        return { letter: op.letter.toUpperCase(), text: op.text.trim() };
      }
      return { letter: String.fromCharCode(65 + i), text: String(op) };
    });
  }, [question]);

  const correctLetter = (question.correct_letter || question.answer)?.trim().toUpperCase();

  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    setSelected(null);
    setAnswered(false);
  }, [question]);

  function handleRespond() {
    if (!selected || answered) return;
    setAnswered(true);
  }

  async function handleNextPress() {
    const wasCorrect = selected === correctLetter;

    // 💥 GUARDAR ID DE LA PREGUNTA EN HISTORIAL
    await saveHistory(question.id);

    const last = index + 1 === total;

    onNext({
      wasCorrect,
      letter: selected,   // 🔥 lo que respondió el usuario
      isLast: last,
      finished: last,     // 🔥 para detectar fin del quiz
    });
  }

  function getOptionStyle(letter) {
    const isSelected = selected === letter;
    const isCorrect = letter === correctLetter;

    if (!answered) {
      return isSelected ? styles.optionSelected : styles.option;
    }

    if (isCorrect) return styles.optionCorrect;
    if (isSelected && !isCorrect) return styles.optionWrong;

    return styles.option;
  }

  return (
    <View style={styles.card}>
      {question.context_text ? (
        <Text style={styles.context}>{question.context_text}</Text>
      ) : null}

      <Text style={styles.question}>{question.question}</Text>

      {options.map((op, i) => (
        <TouchableOpacity
          key={i}
          disabled={answered}
          style={getOptionStyle(op.letter)}
          onPress={() => setSelected(op.letter)}
        >
          <Text style={styles.letter}>{op.letter})</Text>
          <Text style={styles.optionText}>{op.text}</Text>
        </TouchableOpacity>
      ))}

      {!answered && (
        <TouchableOpacity
          style={[styles.answerBtn, !selected && { opacity: 0.4 }]}
          disabled={!selected}
          onPress={handleRespond}
        >
          <Text style={styles.answerBtnText}>Responder</Text>
        </TouchableOpacity>
      )}

      {answered && question.justification && (
        <View style={styles.justificationBox}>
          <Text style={styles.justTitle}>Justificación:</Text>
          <Text style={styles.justText}>{question.justification}</Text>
        </View>
      )}

      {answered && (
        <TouchableOpacity style={styles.nextBtn} onPress={handleNextPress}>
          <Text style={styles.nextText}>
            {index + 1 === total ? "Finalizar" : "Siguiente"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Espaciador para scroll seguro */}
      <View style={{ height: 60 }} />
    </View>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    elevation: 3,
    marginBottom: 20,
  },

  context: {
    fontSize: 15,
    color: "#444",
    marginBottom: 12,
    lineHeight: 20,
  },

  question: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#111",
  },

  option: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#f2f2f2",
    marginBottom: 10,
  },
  optionSelected: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: "#dcd4ff",
  },
  optionCorrect: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#c8f7c5",
    borderWidth: 1,
    borderColor: "#3fa640",
    marginBottom: 10,
  },
  optionWrong: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#ffcccc",
    borderWidth: 1,
    borderColor: "#d62828",
    marginBottom: 10,
  },

  letter: { fontWeight: "bold", fontSize: 17, marginRight: 10 },
  optionText: { fontSize: 15, color: "#333", flexShrink: 1 },

  answerBtn: {
    backgroundColor: "#6a0dad",
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 10,
  },
  answerBtnText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },

  justificationBox: {
    marginTop: 16,
    backgroundColor: "#f3e8ff",
    padding: 12,
    borderRadius: 10,
  },

  justTitle: {
    color: "#6a0dad",
    fontWeight: "700",
    marginBottom: 4,
  },
  justText: { fontSize: 14, color: "#333" },

  nextBtn: {
    marginTop: 16,
    backgroundColor: "#6a0dad",
    paddingVertical: 12,
    borderRadius: 14,
  },
  nextText: {
    color: "#fff",
    fontSize: 17,
    textAlign: "center",
    fontWeight: "600",
  },
});
