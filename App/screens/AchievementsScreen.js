// App/screens/AchievementsScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { getStats, resetStats } from "../services/statsService";
import { ProgressBar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

/**
 * Muestra estadísticas generales y por skill
 */
export default function AchievementsScreen() {
  const [stats, setStats] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const data = await getStats();
      setStats(data);
    })();
  }, []);

  if (!stats) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Aún no has respondido preguntas 😅</Text>
        <Text style={styles.subtitle}>
          Completa algunos simulacros para ver tus estadísticas aquí.
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#6a0dad", marginTop: 25 }]}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.buttonText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const total = stats.totalRespondidas || 0;
  const correctas = stats.totalCorrectas || 0;
  const porcentaje = total > 0 ? Math.round((correctas / total) * 100) : 0;

  const skillsData = Object.entries(stats.skills || {}).map(([skill, data]) => {
    const totalSkill = data.buenas + data.malas;
    const porcentajeSkill =
      totalSkill > 0 ? Math.round((data.buenas / totalSkill) * 100) : 0;
    return { skill, porcentaje: porcentajeSkill, buenas: data.buenas, malas: data.malas };
  });

  const mejorSkill =
    skillsData.length > 0
      ? skillsData.reduce((a, b) => (a.porcentaje > b.porcentaje ? a : b))
      : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      <Text style={styles.title}>🏅 Tus Logros</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Resumen general</Text>
        <Text style={styles.stat}>Preguntas respondidas: {total}</Text>
        <Text style={styles.stat}>Correctas: {correctas}</Text>
        <Text style={styles.stat}>Efectividad: {porcentaje}%</Text>
        <ProgressBar
          progress={porcentaje / 100}
          color="#6a0dad"
          style={{ height: 10, borderRadius: 8, marginTop: 6 }}
        />
      </View>

      {skillsData.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Rendimiento por habilidad</Text>
          {skillsData.map((s, i) => (
            <View key={i} style={styles.skillBox}>
              <Text style={styles.skillName}>{s.skill}</Text>
              <ProgressBar
                progress={s.porcentaje / 100}
                color={s.porcentaje > 70 ? "#4caf50" : s.porcentaje > 50 ? "#ffb300" : "#f44336"}
                style={{ height: 8, borderRadius: 8, flex: 1 }}
              />
              <Text style={styles.skillPercent}>{s.porcentaje}%</Text>
            </View>
          ))}
        </View>
      )}

      {mejorSkill && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>💪 Tu mejor habilidad</Text>
          <Text style={styles.highlight}>
            {mejorSkill.skill} ({mejorSkill.porcentaje}% de acierto)
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#6a0dad" }]}
        onPress={async () => {
          await resetStats();
          setStats(null);
        }}
      >
        <Text style={styles.buttonText}>Reiniciar estadísticas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#999", marginTop: 10 }]}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>Volver al inicio</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6a0dad",
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    color: "#555",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  stat: {
    fontSize: 16,
    color: "#444",
    marginVertical: 2,
  },
  skillBox: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
    gap: 8,
  },
  skillName: {
    flex: 1.2,
    fontSize: 14,
    color: "#333",
  },
  skillPercent: {
    width: 40,
    textAlign: "right",
    fontWeight: "600",
  },
  highlight: {
    textAlign: "center",
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
  },
  button: {
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
