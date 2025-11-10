// App/components/QuestionCard.js
// ==========================================================
// INSQUIZ - QuestionCard (versión final con context_text real)
// ==========================================================
// Muestra el contexto completo desde data/textos_***.json
// usando el "context" de la pregunta como context_title.
// ==========================================================
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { getTextForQuestion } from "../services/textService";

export default function QuestionCard({ question, index, total, onNext }) {
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);

  // 👇 Buscamos el contexto completo desde /data/textos
  const contextData = getTextForQuestion(question);

  const handleSelect = (opt) => {
    if (locked) return;
    setSelected(opt);
    setLocked(true);

    const isCorrect =
      opt === question.answer || opt?.trim() === question.answer?.trim();

    setTimeout(() => {
      onNext && onNext(isCorrect);
    }, 400);
  };

  return (
    <ScrollView style={styles.card}>
      {/* ====== CONTEXTO ====== */}
      {contextData && (
        <View style={styles.contextBox}>
          <Text style={styles.contextTitle}>
            {contextData.context_title || "Contexto"}
          </Text>
          <Text style={styles.contextBody}>
            {contextData.context_text || "Sin contexto disponible."}
          </Text>
        </View>
      )}

      {/* ====== PREGUNTA ====== */}
      <Text style={styles.question}>
        {index + 1}. {question.question}
      </Text>

      {/* ====== OPCIONES ====== */}
      {question.options &&
        question.options.map((opt, i) => {
          const isThisCorrect =
            opt === question.answer ||
            opt?.trim() === question.answer?.trim();
          const isThisSelected = selected === opt;

          let bg = "#fff";
          if (locked && isThisSelected) {
            bg = isThisCorrect ? "#c8e6c9" : "#ffcdd2";
          }

          return (
            <TouchableOpacity
              key={i}
              style={[styles.option, { backgroundColor: bg }]}
              onPress={() => handleSelect(opt)}
              activeOpacity={0.7}
              disabled={locked}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
    </ScrollView>
  );
}

// ==========================================================
// 🎨 ESTILOS
// ==========================================================
const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  contextBox: {
    backgroundColor: "#f3f2ff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  contextTitle: {
    fontWeight: "bold",
    color: "#6a0dad",
    marginBottom: 6,
    fontSize: 16,
  },
  contextBody: {
    color: "#333",
    lineHeight: 20,
    fontSize: 15,
  },
  question: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 12,
    color: "#222",
  },
  option: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  optionText: {
    color: "#333",
  },
});
