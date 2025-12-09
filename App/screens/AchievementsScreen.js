// App/screens/AchievementsScreen.js
// ==========================================================
// INSQUIZ - AchievementsScreen Moderno (XP + Logros + Scroll PRO)
// ==========================================================

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { XP_GetProfile } from "../engines/XP_Engine";
import { getStats } from "../services/statsService";
import { evaluateAchievements } from "../engines/Achievement_Engine";
import ScrollWrapper from "../components/ScrollWrapper"; // ← barrita sutil

export default function AchievementsScreen({ navigation }) {
  const [xp, setXp] = useState(null);
  const [stats, setStats] = useState(null);
  const [unlocked, setUnlocked] = useState([]);
  const [locked, setLocked] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const xpData = await XP_GetProfile();
      const statsData = await getStats();
      const ach = await evaluateAchievements();

      // estructuras seguras
      const safeXP = {
        level: xpData?.level || 1,
        xp: xpData?.xp || 0,
        xpToNext: xpData?.xpToNext || 50,
        totalXp: xpData?.totalXp || 0,
      };

      const safeStats = {
        totalAnswered: statsData?.totalAnswered || 0,
        totalCorrect: statsData?.totalCorrect || 0,
        subjects: statsData?.subjects || {},
        modes: statsData?.modes || {},
        skills: statsData?.skills || {},
        bestPerfect: statsData?.bestPerfect || 0,
      };

      setXp(safeXP);
      setStats(safeStats);
      setUnlocked(ach.unlocked);
      setLocked(ach.locked);
    } catch (e) {
      console.log("❌ ERROR cargando logros:", e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6a0dad" />
        <Text style={{ color: "#6a0dad", marginTop: 8 }}>Cargando logros…</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollWrapper style={{ flex: 1 }}>
        <View style={{ paddingBottom: 70 }}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Logros</Text>

            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
              <Ionicons name="stats-chart-outline" size={26} color="#6a0dad" />
            </TouchableOpacity>
          </View>

          {/* XP CARD */}
          <View style={styles.xpCard}>
            <Text style={styles.level}>Nivel {xp.level}</Text>

            <View style={styles.xpBarBack}>
              <View
                style={[
                  styles.xpBarFill,
                  { width: `${(xp.xp / xp.xpToNext) * 100}%` },
                ]}
              />
            </View>

            <Text style={styles.xpText}>
              {xp.xp} / {xp.xpToNext} XP
            </Text>
          </View>

          {/* SECCIÓN DE DESBLOQUEADOS */}
          <Text style={styles.sectionTitle}>Desbloqueados</Text>

          {unlocked.length === 0 && (
            <Text style={styles.emptyText}>
              Aún no tienes logros desbloqueados…
            </Text>
          )}

          {unlocked.map((ach, idx) => (
            <View key={idx} style={styles.achievementCardUnlocked}>
              <Ionicons name="trophy" size={30} color="#fff" />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.achTitleUnlocked}>{ach.name}</Text>
                <Text style={styles.achDescUnlocked}>{ach.description}</Text>
              </View>
            </View>
          ))}

          {/* SECCIÓN BLOQUEADOS */}
          <Text style={styles.sectionTitle}>Bloqueados</Text>

          {locked.length === 0 && (
            <Text style={styles.emptyText}>No quedan logros bloqueados.</Text>
          )}

          {locked.map((ach, idx) => (
            <View key={idx} style={styles.achievementCardLocked}>
              <Ionicons
                name="lock-closed-outline"
                size={28}
                color="#6a0dad"
              />

              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.achTitleLocked}>{ach.name}</Text>
                <Text style={styles.achDescLocked}>{ach.description}</Text>

                {/* PROGRESO */}
                {ach.progress !== undefined && (
                  <>
                    <View style={styles.progressBarBack}>
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${ach.progress * 100}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressLabel}>
                      {Math.round(ach.progress * 100)}%
                    </Text>
                  </>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollWrapper>
    </View>
  );
}

// ==========================================================
// ESTILOS MODERNOS
// ==========================================================
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 22,
    paddingTop: 34,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#6a0dad",
  },

  xpCard: {
    backgroundColor: "#f6f0ff",
    padding: 18,
    width: "88%",
    alignSelf: "center",
    borderRadius: 18,
    marginTop: 4,
    marginBottom: 16,
  },
  level: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6a0dad",
    marginBottom: 6,
  },
  xpBarBack: {
    width: "100%",
    height: 12,
    backgroundColor: "#e3d4ff",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 4,
  },
  xpBarFill: {
    height: "100%",
    backgroundColor: "#6a0dad",
  },
  xpText: {
    textAlign: "right",
    fontWeight: "600",
    color: "#6a0dad",
    fontSize: 13,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#333",
    marginLeft: 22,
    marginTop: 20,
    marginBottom: 6,
  },

  emptyText: {
    textAlign: "center",
    marginVertical: 12,
    color: "#777",
  },

  // UNLOCKED ACHIEVEMENTS
  achievementCardUnlocked: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6a0dad",
    padding: 14,
    width: "87%",
    alignSelf: "center",
    borderRadius: 16,
    marginTop: 12,
  },
  achTitleUnlocked: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  achDescUnlocked: {
    fontSize: 13,
    color: "#e8d7ff",
  },

  // LOCKED ACHIEVEMENTS
  achievementCardLocked: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6f0ff",
    padding: 14,
    width: "87%",
    alignSelf: "center",
    borderRadius: 16,
    marginTop: 14,
  },
  achTitleLocked: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  achDescLocked: {
    fontSize: 13,
    color: "#666",
  },

  progressBarBack: {
    width: "100%",
    height: 8,
    backgroundColor: "#e0d0ff",
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 6,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#6a0dad",
  },
  progressLabel: {
    color: "#6a0dad",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
});
