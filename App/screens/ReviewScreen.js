// App/screens/ReviewScreen.js
// ==========================================================
// INSQUIZ — REVIEW SCREEN
// Muestra todas las preguntas del intento + lo que respondió el usuario
// ==========================================================

import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ReviewScreen({ route, navigation }) {
  const { questions = [], area = "Revisión", mode } = route.params || {};

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.header}>Revisión · {area}</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView style={{ paddingHorizontal: 16, marginTop: 8 }}>
        {questions.map((q, i) => {
          const correctLetter = (q.correct_letter || q.answer || "")
            .toString()
            .trim()
            .toUpperCase();
          const userLetter = (q.userAnswer || "")
            .toString()
            .trim()
            .toUpperCase();

          return (
            <View key={q.id || i} style={styles.card}>
              <Text style={styles.number}>Pregunta {i + 1}</Text>

              {q.context_text ? (
                <Text style={styles.context}>{q.context_text}</Text>
              ) : null}

              <Text style={styles.question}>{q.question}</Text>

              {/* Opciones */}
              {q.options?.map((op) => {
                const letter = op.letter?.toUpperCase();
                const isCorrect = letter === correctLetter;
                const isUser = letter === userLetter;

                let styleOpt = styles.option;
                if (isCorrect) styleOpt = styles.correctOption;
                if (isUser && !isCorrect) styleOpt = styles.userWrongOption;
                if (isUser && isCorrect) styleOpt = styles.userCorrectOption;

                return (
                  <View key={letter} style={styleOpt}>
                    <Text style={styles.optionLetter}>{letter})</Text>
                    <Text style={styles.optionText}>{op.text}</Text>
                  </View>
                );
              })}

              {/* Resumen de respuesta */}
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>
                  Tu respuesta:{" "}
                  <Text style={styles.bold}>
                    {userLetter || "—"}
                  </Text>
                </Text>
                <Text style={styles.summaryText}>
                  Correcta:{" "}
                  <Text style={styles.bold}>{correctLetter || "—"}</Text>
                </Text>
              </View>

              {q.justification ? (
                <View style={styles.justBox}>
                  <Text style={styles.justTitle}>Justificación</Text>
                  <Text style={styles.justText}>{q.justification}</Text>
                </View>
              ) : null}
            </View>
          );
        })}

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050509" },

  topBar: {
    marginTop: 40,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  header: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },

  card: {
    backgroundColor: "#141320",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderColor: "#26263a",
    borderWidth: 1,
  },

  number: {
    fontSize: 13,
    color: "#aaa",
    marginBottom: 8,
  },

  context: {
    color: "#ddd",
    fontSize: 13,
    marginBottom: 10,
  },

  question: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 12,
  },

  option: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#1e1b2b",
    marginBottom: 6,
  },

  correctOption: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#243b16",
    borderColor: "#67ff6f",
    borderWidth: 1,
    marginBottom: 6,
  },

  userWrongOption: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#3b1616",
    borderColor: "#ff5c5c",
    borderWidth: 1,
    marginBottom: 6,
  },

  userCorrectOption: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#1d4025",
    borderColor: "#67ff6f",
    borderWidth: 1,
    marginBottom: 6,
  },

  optionLetter: { color: "#b45cff", marginRight: 6, fontWeight: "700" },
  optionText: { color: "#eee", flexShrink: 1 },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  summaryText: {
    color: "#d0cff2",
    fontSize: 13,
  },
  bold: { fontWeight: "700", color: "#fff" },

  justBox: {
    marginTop: 12,
    backgroundColor: "#2b2640",
    padding: 12,
    borderRadius: 12,
  },

  justTitle: {
    color: "#ffcb3b",
    fontWeight: "800",
    marginBottom: 4,
  },

  justText: {
    color: "#ddd",
    fontSize: 13,
  },
});
