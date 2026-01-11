// ===========================================================
// INSQUIZ — CLASSIC QUESTION CARD (A–D)
// ===========================================================

import React, { useState, useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { saveHistory } from "../engines/HistoryEngine";

export default function ClassicQuestionCard({
  question,
  index = 0,
  total = 1,
  onNext,
}) {
  if (!question || !question.options) return null;

  const hasNext = typeof onNext === "function";

  const options = useMemo(() => {
    return question.options.map((op, i) => {
      if (typeof op === "string") {
        const m = op.match(/^([A-D])\)\s*(.*)$/i);
        if (m) return { letter: m[1], text: m[2] };
        return { letter: String.fromCharCode(65 + i), text: op };
      }
      return { letter: op.letter, text: op.text };
    });
  }, [question]);

  const correctLetter =
    (question.correct_letter || question.answer || "A").toUpperCase();

  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    setSelected(null);
    setAnswered(false);
  }, [question.id]);

  async function nextClassic() {
    if (!hasNext) return;
    await saveHistory(question.id);
    onNext({ letter: selected });
  }

  return (
    <View style={styles.card}>
      {question.context_text && (
        <Text style={styles.context}>{question.context_text}</Text>
      )}

      <Text style={styles.question}>{question.question}</Text>

      {options.map((op, i) => {
        let style = styles.option;
        if (answered) {
          if (op.letter === correctLetter) style = styles.optionCorrect;
          else if (selected === op.letter) style = styles.optionWrong;
        } else if (selected === op.letter) {
          style = styles.optionSelected;
        }

        return (
          <TouchableOpacity
            key={i}
            style={style}
            disabled={answered}
            onPress={() => setSelected(op.letter)}
          >
            <Text style={styles.letter}>{op.letter})</Text>
            <Text style={styles.optionText}>{op.text}</Text>
          </TouchableOpacity>
        );
      })}

      {!answered && (
        <TouchableOpacity
          style={[styles.answerBtn, !selected && { opacity: 0.4 }]}
          disabled={!selected}
          onPress={() => setAnswered(true)}
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

      {answered && hasNext && (
        <TouchableOpacity style={styles.nextBtn} onPress={nextClassic}>
          <Text style={styles.nextText}>
            {index + 1 === total ? "Finalizar" : "Siguiente"}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.bottomSpacer} />
    </View>
  );
}

/* =======================
   🎨 STYLES (ORIGINAL)
   ======================= */

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 3,
  },

  context: { fontSize: 15, color: "#444", marginBottom: 12 },
  question: { fontSize: 17, fontWeight: "800", marginBottom: 16 },

  option: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 14,
    backgroundColor: "#f2f2f2",
    marginBottom: 10,
  },
  optionSelected: {
    backgroundColor: "#ede9ff",
    borderColor: "#6a0dad",
    borderWidth: 2,
    flexDirection: "row",
    padding: 14,
    borderRadius: 14,
  },
  optionCorrect: {
    backgroundColor: "#e6f7ea",
    borderColor: "#b0ffb4ff",
    borderWidth: 2,
    flexDirection: "row",
    padding: 14,
    borderRadius: 14,
  },
  optionWrong: {
    backgroundColor: "#fdecea",
    borderColor: "#ffc8c8ff",
    borderWidth: 2,
    flexDirection: "row",
    padding: 14,
    borderRadius: 14,
  },

  letter: { fontWeight: "900", marginRight: 10 },
  optionText: { fontSize: 15 },

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

  justificationBox: {
    marginTop: 16,
    backgroundColor: "#f3e8ff",
    padding: 12,
    borderRadius: 12,
  },
  justTitle: { fontWeight: "800", color: "#6a0dad" },
  justText: { fontSize: 14 },

  bottomSpacer: { height: 70 },
});
