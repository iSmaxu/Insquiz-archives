// App/screens/AchievementsScreen.js
// ==========================================================
//  INSQUIZ - AchievementsScreen PRO (Stats v4 + Skills)
// ==========================================================

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { ProgressBar } from "react-native-paper";
import { getStats, resetStats } from "../services/statsService";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function AchievementsScreen() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    const data = await getStats();
    setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleReset = () => {
    Alert.alert(
      "Reiniciar estadísticas",
      "¿Seguro que quieres borrar todas tus estadísticas y logros locales?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Reiniciar",
          style: "destructive",
          onPress: async () => {
            await resetStats();
            await loadStats();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6a0dad" />
        <Text style={{ color: "#6a0dad", marginTop: 8 }}>
          Cargando estadísticas...
        </Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Sin datos aún</Text>
        <Text style={styles.subtitle}>
          Resuelve algunos quizzes para ver tus logros.
        </Text>
      </View>
    );
  }

  const totalAns = stats.totalAnswered || 0;
  const totalCorrect = stats.totalCorrect || 0;
  const globalPct =
    totalAns > 0 ? ((totalCorrect / totalAns) * 100).toFixed(1) : "0.0";

  const modes = stats.modes || {};
  const subjects = stats.subjects || {};
  const skills = stats.skills || {};
  const bestSkill = stats.bestSkill || null;
  const worstSkill = stats.worstSkill || null;

  // Ordenar skills por porcentaje
  const orderedSkills = Object.entries(skills)
    .map(([sk, val]) => {
      const pct = val.total > 0 ? (val.correct / val.total) * 100 : 0;
      return { name: sk, ...val, pct };
    })
    .sort((a, b) => b.pct - a.pct);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.headerBox}>
        <Text style={styles.title}>Mis logros</Text>
        <Text style={styles.subtitle}>Resumen de tu rendimiento en InsQUIZ</Text>
      </View>

      {/* RESUMEN GENERAL */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="stats-chart" size={22} color="#6a0dad" />
          <Text style={styles.cardTitle}>Resumen general</Text>
        </View>

        <Text style={styles.statLine}>
          Preguntas respondidas:{" "}
          <Text style={styles.bold}>{totalAns}</Text>
        </Text>
        <Text style={styles.statLine}>
          Respuestas correctas:{" "}
          <Text style={styles.bold}>{totalCorrect}</Text>
        </Text>
        <Text style={styles.statLine}>
          Precisión global:{" "}
          <Text style={styles.bold}>{globalPct}%</Text>
        </Text>

        <ProgressBar
          progress={totalAns > 0 ? totalCorrect / totalAns : 0}
          style={styles.progress}
        />
      </View>

      {/* POR MODO */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="layers-outline" size={22} color="#6a0dad" />
          <Text style={styles.cardTitle}>Por modo</Text>
        </View>

        {["practice", "adaptive", "realsim"].map((m) => {
          const entry = modes[m] || { correct: 0, total: 0 };
          const pct =
            entry.total > 0 ? ((entry.correct / entry.total) * 100).toFixed(1) : "0.0";

          const label =
            m === "practice"
              ? "Modo práctica"
              : m === "adaptive"
              ? "Modo adaptativo"
              : "Simulacro Real";

          return (
            <View key={m} style={styles.modeRow}>
              <Text style={styles.modeName}>{label}</Text>
              <Text style={styles.modePct}>{pct}%</Text>
            </View>
          );
        })}
      </View>

      {/* POR MATERIA */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="book-education" size={22} color="#6a0dad" />
          <Text style={styles.cardTitle}>Por materia</Text>
        </View>

        {Object.keys(subjects).length === 0 ? (
          <Text style={styles.noData}>
            Todavía no hay suficiente información por materia.
          </Text>
        ) : (
          Object.entries(subjects).map(([sub, val]) => {
            const pct =
              val.total > 0 ? ((val.correct / val.total) * 100).toFixed(1) : "0.0";

            return (
              <View key={sub} style={styles.subjectRow}>
                <Text style={styles.subjectName}>{sub}</Text>
                <Text style={styles.subjectPct}>{pct}%</Text>
              </View>
            );
          })
        )}
      </View>

      {/* SKILLS */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="brain" size={22} color="#6a0dad" />
          <Text style={styles.cardTitle}>Habilidades (skills)</Text>
        </View>

        {orderedSkills.length === 0 ? (
          <Text style={styles.noData}>
            Todavía no hay datos de habilidades. Practica más para ver tu perfil.
          </Text>
        ) : (
          <>
            {/* Mejor / peor skill */}
            <View style={styles.skillSummary}>
              <Text style={styles.skillSummaryText}>
                🏆 Mejor skill:{" "}
                <Text style={styles.bold}>
                  {bestSkill || orderedSkills[0]?.name}
                </Text>
              </Text>
              <Text style={styles.skillSummaryText}>
                ⚠️ Skill a mejorar:{" "}
                <Text style={styles.bold}>
                  {worstSkill || orderedSkills[orderedSkills.length - 1]?.name}
                </Text>
              </Text>
            </View>

            {/* Lista de skills */}
            {orderedSkills.map((s, idx) => (
              <View key={idx} style={styles.skillRow}>
                <Text style={styles.skillName}>{s.name}</Text>
                <Text style={styles.skillPct}>{s.pct.toFixed(1)}%</Text>
              </View>
            ))}
          </>
        )}
      </View>

      {/* BOTÓN RESETEAR */}
      <View style={{ alignItems: "center", marginTop: 10 }}>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <MaterialCommunityIcons
            name="backup-restore"
            size={20}
            color="#d62828"
          />
          <Text style={styles.resetText}>Reiniciar estadísticas</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ==========================================================
// 🎨 Estilos
// ==========================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#6a0dad",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },

  headerBox: {
    alignItems: "center",
    marginBottom: 18,
    marginTop: 10,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginLeft: 6,
  },

  statLine: {
    fontSize: 14,
    color: "#444",
    marginTop: 4,
  },
  bold: {
    fontWeight: "700",
    color: "#6a0dad",
  },
  progress: {
    marginTop: 10,
    height: 8,
    borderRadius: 10,
  },

  modeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  modeName: {
    fontSize: 14,
    color: "#444",
  },
  modePct: {
    fontSize: 14,
    color: "#6a0dad",
    fontWeight: "700",
  },

  subjectRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  subjectName: {
    fontSize: 14,
    color: "#444",
  },
  subjectPct: {
    fontSize: 14,
    color: "#6a0dad",
    fontWeight: "700",
  },

  noData: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },

  skillSummary: {
    marginTop: 4,
    marginBottom: 10,
  },
  skillSummaryText: {
    fontSize: 14,
    color: "#444",
  },

  skillRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  skillName: {
    fontSize: 14,
    color: "#333",
  },
  skillPct: {
    fontSize: 14,
    color: "#6a0dad",
    fontWeight: "700",
  },

  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#d62828",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  resetText: {
    color: "#d62828",
    fontWeight: "700",
    marginLeft: 6,
  },
});
