// App/screens/RealSimReviewScreen.js
// ==========================================================
// INSQUIZ - RealSimReviewScreen (Versión final para 390 preguntas)
// ==========================================================
// Muestra el desglose completo del Simulacro Real:
//  - Pregunta
//  - Contexto
//  - Tu respuesta
//  - Respuesta correcta
//  - Justificación
//  - Indicador de acierto/error
// ==========================================================

import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function RealSimReviewScreen({ route, navigation }) {
  const { questions = [], answers = [], score = 0 } = route.params || {};

  if (!questions.length || !answers.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>No hay datos para revisar</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      {/* ENCABEZADO */}
      <View style={styles.headerBox}>
        <Text style={styles.header}>📘 Revisión del Simulacro Real</Text>
        <Text style={styles.subHeader}>Resultados generales:</Text>
        <Text style={styles.scoreText}>
          Aciertos: {score} / {questions.length}
        </Text>
      </View>

      {/* LISTA DE PREGUNTAS */}
      {answers.map((ans, index) => {
        const q = questions[index];
        const correct = ans.correct;

        return (
          <View
            key={`${q.id}-${index}`}
            style={[
              styles.card,
              correct ? styles.cardCorrect : styles.cardIncorrect,
            ]}
          >
            {/* Título */}
            <Text style={styles.qNumber}>Pregunta {index + 1}</Text>

            {/* Contexto */}
            {q.context_text ? (
              <View style={styles.contextBox}>
                <Text style={styles.contextTitle}>Texto:</Text>
                <Text style={styles.contextText}>{q.context_text}</Text>
              </View>
            ) : null}

            {/* Pregunta */}
            <Text style={styles.question}>{q.question}</Text>

            {/* Tu respuesta */}
            <Text style={styles.label}>Tu respuesta:</Text>
            <Text
              style={[
                styles.value,
                correct ? styles.correctText : styles.incorrectText,
              ]}
            >
              {ans.selected || "Sin responder"}
            </Text>

            {/* Respuesta correcta */}
            {!correct && (
              <>
                <Text style={styles.label}>Respuesta correcta:</Text>
                <Text style={[styles.value, styles.correctText]}>
                  {q.answer}
                </Text>
              </>
            )}

            {/* Justificación */}
            {q.justification ? (
              <View style={styles.justBox}>
                <Text style={styles.label}>Justificación:</Text>
                <Text style={styles.justText}>{q.justification}</Text>
              </View>
            ) : null}
          </View>
        );
      })}
    </ScrollView>
  );
}

// ==========================================================
// ESTILOS
// ==========================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    padding: 12,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loading: { fontSize: 18, color: "#6a0dad", fontWeight: "bold" },

  headerBox: {
    alignItems: "center",
    marginBottom: 18,
    marginTop: 10,
  },
  header: { fontSize: 22, fontWeight: "bold", color: "#6a0dad" },
  subHeader: { fontSize: 16, color: "#555", marginTop: 4 },
  scoreText: {
    fontSize: 22,
    marginTop: 8,
    fontWeight: "800",
    color: "#6a0dad",
  },

  // Tarjetas
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 6,
  },

  cardCorrect: {
    borderLeftColor: "#4caf50",
  },
  cardIncorrect: {
    borderLeftColor: "#f44336",
  },

  qNumber: { fontSize: 16, fontWeight: "700", marginBottom: 6, color: "#444" },
  question: {
    fontSize: 16,
    color: "#222",
    fontWeight: "bold",
    marginBottom: 8,
  },

  // Contexto
  contextBox: {
    backgroundColor: "#f0f0ff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  contextTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6a0dad",
    marginBottom: 4,
  },
  contextText: {
    fontSize: 14,
    color: "#444",
  },

  // Campos
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    color: "#555",
  },
  value: {
    fontSize: 15,
    marginTop: 2,
  },
  correctText: {
    color: "#4caf50",
    fontWeight: "bold",
  },
  incorrectText: {
    color: "#f44336",
    fontWeight: "bold",
  },

  // Justificación
  justBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
  },
  justText: {
    color: "#444",
    fontSize: 14,
  },
});
