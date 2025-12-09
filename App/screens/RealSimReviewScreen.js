// App/screens/RealSimReviewScreen.js
// ==========================================================
//  INSQUIZ - RealSimReview (Revisión Simulacro ICFES)
// ==========================================================

import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function RealSimReviewScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { answers = [], total = 0, correct = 0 } = route.params || {};

  const pct = useMemo(() => {
    if (!total) return 0;
    return ((correct / total) * 100).toFixed(1);
  }, [correct, total]);

  // Mapeo de códigos de materia a etiquetas
  const subjectLabels = {
    LQ: "Lectura crítica",
    MT: "Matemáticas",
    CS: "Sociales y Ciudadanas",
    CN: "Ciencias Naturales",
    EN: "Inglés",
    realsim: "Simulacro ICFES",
  };

  function getSubjectLabel(q) {
    const code = (q.subject || "").toUpperCase();
    return subjectLabels[code] || "Área general";
  }

  function getOptions(q) {
    if (Array.isArray(q.options) && q.options.length > 0) {
      return q.options;
    }

    const opts = [];
    if (q.optionA) opts.push(q.optionA);
    if (q.optionB) opts.push(q.optionB);
    if (q.optionC) opts.push(q.optionC);
    if (q.optionD) opts.push(q.optionD);
    return opts;
  }

  function getCorrectIndex(q) {
    const ans = q.answer;
    if (typeof ans === "string") {
      const key = ans.trim().toUpperCase();
      const map = { A: 0, B: 1, C: 2, D: 3 };
      if (map[key] !== undefined) return map[key];
    }
    if (typeof ans === "number") return ans;
    return -1;
  }

  function goHome() {
    // Lleva al drawer "Home"
    navigation.navigate("Home");
  }

  // Si por algún motivo no llegaron datos
  if (!answers || answers.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>No hay datos del simulacro.</Text>
        <TouchableOpacity style={styles.homeBtn} onPress={goHome}>
          <Ionicons name="home-outline" size={20} color="#fff" />
          <Text style={styles.homeBtnText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header superior */}
      <View style={styles.header}>
        <Text style={styles.title}>Resumen del Simulacro ICFES</Text>
        <Text style={styles.subtitle}>RealSim — Revisión completa</Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Correctas</Text>
            <Text style={styles.summaryValue}>{correct}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryValue}>{total}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Porcentaje</Text>
            <Text style={styles.summaryValue}>{pct}%</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.homeBtn} onPress={goHome}>
          <Ionicons name="home-outline" size={20} color="#fff" />
          <Text style={styles.homeBtnText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de preguntas */}
      <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 24 }}>
        {answers.map((q, idx) => {
          const options = getOptions(q);
          const correctIndex = getCorrectIndex(q);
          const area = getSubjectLabel(q);

          return (
            <View key={q.id || idx} style={styles.card}>
              <Text style={styles.qHeader}>
                Pregunta {idx + 1} · <Text style={styles.qArea}>{area}</Text>
              </Text>

              {q.context_text ? (
                <Text style={styles.context}>{q.context_text}</Text>
              ) : null}

              {q.question ? (
                <Text style={styles.question}>{q.question}</Text>
              ) : null}

              {/* Opciones */}
              <View style={{ marginTop: 8 }}>
                {options.map((opt, i) => {
                  const isCorrect = i === correctIndex;
                  const letter = ["A", "B", "C", "D"][i] || "?";

                  return (
                    <View
                      key={i}
                      style={[
                        styles.optionRow,
                        isCorrect && styles.optionCorrect,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionLetter,
                          isCorrect && styles.optionLetterCorrect,
                        ]}
                      >
                        {letter}
                      </Text>
                      <Text
                        style={[
                          styles.optionText,
                          isCorrect && styles.optionTextCorrect,
                        ]}
                      >
                        {opt}
                      </Text>
                    </View>
                  );
                })}
              </View>

              {/* Justificación */}
              {q.justification ? (
                <View style={styles.justifBox}>
                  <Text style={styles.justifTitle}>Justificación</Text>
                  <Text style={styles.justifText}>{q.justification}</Text>
                </View>
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ==========================================================
// STYLES
// ==========================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f2ff",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: "#6a0dad",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
  },
  subtitle: {
    marginTop: 4,
    color: "#e8d9ff",
    fontSize: 14,
  },
  summaryRow: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "space-between",
  },
  summaryItem: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  summaryLabel: {
    color: "#f5e6ff",
    fontSize: 12,
  },
  summaryValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },
  homeBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  homeBtnText: {
    color: "#6a0dad",
    fontWeight: "700",
    marginLeft: 6,
  },
  list: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  qHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6a0dad",
    marginBottom: 4,
  },
  qArea: {
    fontWeight: "900",
  },
  context: {
    fontSize: 13,
    color: "#555",
    marginBottom: 6,
  },
  question: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginTop: 4,
  },
  optionCorrect: {
    backgroundColor: "#e3f7e8",
  },
  optionLetter: {
    fontWeight: "800",
    marginRight: 6,
    color: "#555",
    marginTop: 1,
  },
  optionLetterCorrect: {
    color: "#2e7d32",
  },
  optionText: {
    flex: 1,
    color: "#333",
    fontSize: 13,
  },
  optionTextCorrect: {
    color: "#1b5e20",
    fontWeight: "600",
  },
  justifBox: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#f6f0ff",
    borderRadius: 10,
  },
  justifTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#6a0dad",
    marginBottom: 4,
  },
  justifText: {
    fontSize: 13,
    color: "#444",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6a0dad",
    marginBottom: 10,
  },
});
