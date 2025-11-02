// components/QuestionCard.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function QuestionCard({ question, index, total, onAnswer }) {
  return (
    <View style={styles.card}>
      <Text style={styles.progress}>
        Pregunta {index + 1} de {total}
      </Text>
      <Text style={styles.question}>{question.pregunta}</Text>

      {question.opciones?.map((opt, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => onAnswer(opt)}
          style={styles.option}
        >
          <Text>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  progress: {
    color: "#555",
    marginBottom: 8,
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  option: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
});
