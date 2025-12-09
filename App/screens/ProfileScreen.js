// App/screens/ProfileScreen.js
// ==========================================================
//  INSQUIZ - Mi Rendimiento (XP Engine + Stats + Resultados)
// ==========================================================

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { ProgressBar } from "react-native-paper";
import { XP_GetProfile } from "../engines/XP_Engine";
import { getStats } from "../services/statsService";
import { getAllResults } from "../services/resultService"; // historial real

export default function ProfileScreen({ navigation }) {
  const [xp, setXP] = useState(null);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    (async () => {
      // 🔥 XP Engine sincronizado
      const xpProfile = await XP_GetProfile();
      setXP(xpProfile);

      // 🔥 Estadísticas del sistema real
      const s = await getStats();
      setStats(s);

      // 🔥 Historial real (practice + realsim)
      const results = await getAllResults();
      setHistory(results.reverse().slice(0, 10)); // últimos 10
    })();
  }, []);

  // Si nada cargado aún
  if (!xp || !stats) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>Cargando rendimiento…</Text>
      </View>
    );
  }

  // --------------------------
  //  RESUMEN GLOBAL DE STATS
  // --------------------------
  const total = stats.totalAnswered || 0;
  const correct = stats.totalCorrect || 0;
  const globalPct = total ? ((correct / total) * 100).toFixed(1) : 0;

  // --------------------------
  //  ANALISIS DE SKILLS
  // --------------------------
  const skills = stats.skills || {};

  const bestSkill = Object.entries(skills).length
    ? Object.entries(skills).reduce(
        (best, [skill, val]) => {
          const pct = val.total > 0 ? (val.correct / val.total) * 100 : 0;
          return pct > best.pct ? { skill, pct } : best;
        },
        { skill: "Ninguna", pct: 0 }
      )
    : { skill: "Ninguna", pct: 0 };

  const worstSkill = Object.entries(skills).length
    ? Object.entries(skills).reduce(
        (worst, [skill, val]) => {
          const pct = val.total > 0 ? (val.correct / val.total) * 100 : 100;
          return pct < worst.pct ? { skill, pct } : worst;
        },
        { skill: "Ninguna", pct: 100 }
      )
    : { skill: "Ninguna", pct: 100 };

  return (
    <ScrollView 
  style={styles.container}
  contentContainerStyle={{ paddingBottom: 45 }}
>

      {/* TITULO */}
      <Text style={styles.title}>📈 Mi Rendimiento</Text>

      {/* XP ENGINE */}
      <View style={styles.card}>
        <Text style={styles.section}>Progreso del nivel</Text>

        <Text style={styles.stat}>
          Nivel actual: <Text style={styles.bold}>{xp.level}</Text>
        </Text>

        <Text style={styles.stat}>
          XP:{" "}
          <Text style={styles.bold}>
            {xp.xp} / {xp.xpToNext}
          </Text>
        </Text>

        <ProgressBar
          progress={xp.xp / xp.xpToNext}
          color="#6a0dad"
          style={styles.progress}
        />

        <Text style={styles.stat}>
          XP total acumulado: <Text style={styles.bold}>{xp.totalXp}</Text>
        </Text>
      </View>

      {/* RESUMEN GENERAL */}
      <View style={styles.card}>
        <Text style={styles.section}>Resumen general</Text>
        <Text style={styles.stat}>Preguntas respondidas: {total}</Text>
        <Text style={styles.stat}>Correctas: {correct}</Text>
        <Text style={styles.stat}>
          Precisión global: {globalPct}%
        </Text>
        <ProgressBar
          progress={parseFloat(globalPct) / 100}
          color="#6a0dad"
          style={styles.progress}
        />
      </View>

      {/* HABILIDADES */}
      <View style={styles.card}>
        <Text style={styles.section}>Habilidades</Text>

        <Text style={[styles.skillBest]}>
          🧠 Mejor habilidad:{" "}
          <Text style={styles.bold}>
            {bestSkill.skill} ({bestSkill.pct.toFixed(1)}%)
          </Text>
        </Text>

        <Text style={[styles.skillWeak]}>
          ⚠️ Más débil:{" "}
          <Text style={styles.bold}>
            {worstSkill.skill} ({worstSkill.pct.toFixed(1)}%)
          </Text>
        </Text>
      </View>

      {/* HISTORIAL DE RESULTADOS */}
      <View style={styles.card}>
        <Text style={styles.section}>Historial reciente</Text>

        {history.length === 0 ? (
          <Text style={styles.stat}>Aún no tienes resultados.</Text>
        ) : (
          history.map((item, i) => (
            <View key={i} style={styles.historyItem}>
              <Text style={styles.historyText}>
                {item.area} — {item.correct}/{item.total} ({Math.round(
                  (item.correct / item.total) * 100
                )}
                %)
              </Text>
              <Text style={styles.historyDate}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
          ))
        )}
      </View>

      {/* BOTÓN IR A LOGROS */}
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate("Achievements")}
      >
        <Text style={styles.btnText}>Ver logros detallados</Text>

      </TouchableOpacity>

      
    </ScrollView>
  );
}

// ==========================================================
// 🎨 Estilos
// ==========================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },

  title: {
    fontSize: 26,
    color: "#6a0dad",
    fontWeight: "900",
    textAlign: "center",
    marginVertical: 10,
  },

  card: {
    backgroundColor: "#f8f5ff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },

  section: {
    fontSize: 18,
    color: "#6a0dad",
    fontWeight: "800",
    marginBottom: 10,
  },

  stat: {
    fontSize: 15,
    color: "#444",
    marginVertical: 2,
  },

  bold: {
    fontWeight: "900",
    color: "#6a0dad",
  },

  progress: {
    height: 10,
    borderRadius: 10,
    marginVertical: 8,
  },

  skillBest: { fontSize: 15, color: "#4caf50", marginTop: 4 },
  skillWeak: { fontSize: 15, color: "#e53935", marginTop: 4 },

  historyItem: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
  },

  historyText: { fontSize: 15, color: "#333", fontWeight: "600" },
  historyDate: { fontSize: 12, color: "#777", marginTop: 2 },

  btn: {
    backgroundColor: "#6a0dad",
    paddingVertical: 12,
    marginTop: 10,
    borderRadius: 12,
  },
  btnText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loading: { fontSize: 16, color: "#6a0dad" },
});
