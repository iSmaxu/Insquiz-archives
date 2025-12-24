// App/screens/ReviewScreen.js
// ==========================================================
// INSQUIZ — REVIEW SCREEN
// - SafeArea en header
// - Separadores
// - Filtros: correctas / incorrectas / justificación
// ==========================================================

import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { loadLastAttempt } from "../store/AttemptStore";

export default function ReviewScreen({ navigation }) {
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🎛️ FILTROS
  const [filterMode, setFilterMode] = useState("all"); // all | correct | wrong
  const [showJustification, setShowJustification] = useState(true);

  useEffect(() => {
    async function load() {
      const a = await loadLastAttempt();
      setAttempt(a);
      setLoading(false);
    }
    load();
  }, []);

  const filteredQuestions = useMemo(() => {
    if (!attempt?.questions) return [];

    return attempt.questions.filter(q => {
      const correct = (q.correct_letter || q.answer || "").toUpperCase();
      const user = (q.userAnswer || "").toUpperCase();

      if (filterMode === "correct") {
        return user && user === correct;
      }
      if (filterMode === "wrong") {
        return !user || user !== correct;
      }
      return true; // all
    });
  }, [attempt, filterMode]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Cargando revisión…</Text>
      </View>
    );
  }

  if (!attempt || !attempt.questions?.length) {
    return (
      <View style={styles.center}>
        <Text>No hay intento para revisar.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ marginTop: 12 }}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* SAFE HEADER */}
      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#111" />
          </TouchableOpacity>

          <Text style={styles.headerText}>
            Revisión · {attempt.area}
          </Text>

          <View style={{ width: 22 }} />
        </View>

        {/* 🎛️ PANEL DE FILTROS */}
        <View style={styles.filters}>
          <View style={styles.filterGroup}>
            <FilterBtn
              label="Todas"
              active={filterMode === "all"}
              onPress={() => setFilterMode("all")}
            />
            <FilterBtn
              label="Correctas"
              active={filterMode === "correct"}
              onPress={() => setFilterMode("correct")}
            />
            <FilterBtn
              label="Incorrectas"
              active={filterMode === "wrong"}
              onPress={() => setFilterMode("wrong")}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.justToggle,
              showJustification && styles.justToggleActive,
            ]}
            onPress={() => setShowJustification(v => !v)}
          >
            <Ionicons
              name={showJustification ? "eye" : "eye-off"}
              size={16}
              color={showJustification ? "#6a0dad" : "#555"}
            />
            <Text
              style={[
                styles.justToggleText,
                showJustification && { color: "#6a0dad" },
              ]}
            >
              Justificación
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scroll}>
        {filteredQuestions.map((q, i) => {
          const correct = (q.correct_letter || q.answer || "").toUpperCase();
          const user = (q.userAnswer || "").toUpperCase();

          return (
            <View key={q.id || i}>
              <View style={styles.card}>
                {q.context_text && (
                  <Text style={styles.context}>{q.context_text}</Text>
                )}

                <Text style={styles.question}>{q.question}</Text>

                {(q.options || []).map((op, idx) => {
                  const letter =
                    op.letter || String.fromCharCode(65 + idx);
                  const text = op.text || op;

                  const isUser = letter === user;
                  const isCorrect = letter === correct;

                  return (
                    <View
                      key={idx}
                      style={[
                        styles.option,
                        isCorrect && styles.correct,
                        isUser && !isCorrect && styles.wrong,
                      ]}
                    >
                      <Text style={styles.optLetter}>{letter})</Text>
                      <Text style={styles.optText}>{text}</Text>
                    </View>
                  );
                })}

                <Text style={styles.result}>
                  Tu respuesta: {user || "—"} · Correcta: {correct || "—"}
                </Text>

                {showJustification && q.justification && (
                  <View style={styles.justBox}>
                    <Text style={styles.justTitle}>Justificación</Text>
                    <Text style={styles.justText}>{q.justification}</Text>
                  </View>
                )}
              </View>

              {i < filteredQuestions.length - 1 && (
                <View style={styles.separator} />
              )}
            </View>
          );
        })}

        {filteredQuestions.length === 0 && (
          <View style={styles.center}>
            <Text>No hay preguntas para este filtro.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

/* -------------------------------------------------- */
/* COMPONENTE BOTÓN FILTRO */
/* -------------------------------------------------- */
function FilterBtn({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.filterBtn,
        active && styles.filterBtnActive,
      ]}
    >
      <Text
        style={[
          styles.filterText,
          active && styles.filterTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/* -------------------------------------------------- */
/* ESTILOS */
/* -------------------------------------------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  safeHeader: { backgroundColor: "#fff" },

  topBar: {
    height: 56,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  headerText: { fontSize: 16, fontWeight: "800", color: "#111" },

  filters: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  filterGroup: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },

  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#f0f0f0",
  },

  filterBtnActive: {
    backgroundColor: "#efe6ff",
  },

  filterText: { fontSize: 13, fontWeight: "700", color: "#555" },
  filterTextActive: { color: "#6a0dad" },

  justToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  justToggleActive: {},

  justToggleText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#555",
  },

  scroll: { padding: 14, paddingBottom: 40 },

  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 16,
    padding: 16,
  },

  context: { color: "#444", marginBottom: 10, lineHeight: 20 },
  question: {
    fontWeight: "800",
    fontSize: 16,
    marginBottom: 12,
  },

  option: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f2f2f2",
    marginBottom: 8,
  },

  correct: { backgroundColor: "#c8f7c5" },
  wrong: { backgroundColor: "#ffcccc" },

  optLetter: { fontWeight: "800", marginRight: 8 },
  optText: { flex: 1 },

  result: { marginTop: 10, fontWeight: "700" },

  justBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#f3e8ff",
    borderRadius: 12,
  },

  justTitle: {
    fontWeight: "800",
    marginBottom: 4,
    color: "#6a0dad",
  },

  justText: { lineHeight: 18 },

  separator: {
    height: 1,
    backgroundColor: "#e6e6e6",
    marginVertical: 20,
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
});
