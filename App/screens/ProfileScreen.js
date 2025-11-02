// App/screens/ProfileScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { ProgressBar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStats } from "../services/statsService";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

export default function ProfileScreen({ navigation }) {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getStats();
      setStats(data);

      const savedHistory = await AsyncStorage.getItem("simulacroHistory");
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    })();
  }, []);

  if (!stats) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Aún no hay datos registrados 📊</Text>
        <Text style={styles.subtitle}>
          Realiza simulacros o responde preguntas para ver tu progreso aquí.
        </Text>
      </View>
    );
  }

  const total = stats.totalRespondidas || 0;
  const correctas = stats.totalCorrectas || 0;
  const porcentaje = total ? Math.round((correctas / total) * 100) : 0;

  const screenWidth = Dimensions.get("window").width - 40;
  const chartData = {
    labels: history.map((_, i) => `Sim ${i + 1}`),
    datasets: [
      {
        data: history.map((h) => h.score),
        strokeWidth: 2,
      },
    ],
  };

  const bestSkill = Object.entries(stats.skills || {}).reduce(
    (best, [skill, data]) => {
      const totalSkill = data.buenas + data.malas;
      const porc = totalSkill ? (data.buenas / totalSkill) * 100 : 0;
      return porc > best.porcentaje ? { skill, porcentaje: porc } : best;
    },
    { skill: "Ninguna", porcentaje: 0 }
  );

  const weakSkill = Object.entries(stats.skills || {}).reduce(
    (worst, [skill, data]) => {
      const totalSkill = data.buenas + data.malas;
      const porc = totalSkill ? (data.buenas / totalSkill) * 100 : 0;
      return porc < worst.porcentaje ? { skill, porcentaje: porc } : worst;
    },
    { skill: "Ninguna", porcentaje: 100 }
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📈 Mi Rendimiento</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Resumen general</Text>
        <Text style={styles.stat}>Preguntas respondidas: {total}</Text>
        <Text style={styles.stat}>Correctas: {correctas}</Text>
        <Text style={styles.stat}>Efectividad global: {porcentaje}%</Text>
        <ProgressBar
          progress={porcentaje / 100}
          color="#6a0dad"
          style={{ height: 8, borderRadius: 8, marginTop: 6 }}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Habilidades destacadas</Text>
        <Text style={styles.best}>🧠 Mejor: {bestSkill.skill} ({bestSkill.porcentaje.toFixed(1)}%)</Text>
        <Text style={styles.weak}>⚠️ Débil: {weakSkill.skill} ({weakSkill.porcentaje.toFixed(1)}%)</Text>
      </View>

      {history.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Evolución de puntajes</Text>
          <LineChart
            data={chartData}
            width={screenWidth}
            height={220}
            yAxisSuffix=" pts"
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fafafa",
              backgroundGradientTo: "#fafafa",
              color: (opacity = 1) => `rgba(106, 13, 173, ${opacity})`,
              labelColor: () => "#555",
              strokeWidth: 2,
              propsForDots: { r: "5", strokeWidth: "2", stroke: "#6a0dad" },
            }}
            bezier
            style={{ marginVertical: 10, borderRadius: 10 }}
          />
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Recomendación personalizada</Text>
        <Text style={styles.tip}>
          {weakSkill.skill !== "Ninguna"
            ? `📚 Te sugerimos reforzar tus conocimientos en "${weakSkill.skill}".`
            : "Sigue practicando para mantener tu rendimiento alto 💪"}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#6a0dad" }]}
        onPress={() => navigation.navigate("Achievements")}
      >
        <Text style={styles.buttonText}>Ver estadísticas detalladas</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", color: "#6a0dad", textAlign: "center", marginVertical: 10 },
  subtitle: { fontSize: 15, color: "#666", textAlign: "center", paddingHorizontal: 20 },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 8 },
  stat: { fontSize: 15, color: "#444", marginVertical: 2 },
  best: { fontSize: 16, color: "#4caf50", fontWeight: "600" },
  weak: { fontSize: 16, color: "#f44336", fontWeight: "600", marginTop: 4 },
  tip: { fontSize: 14, color: "#444", marginTop: 6 },
  button: { paddingVertical: 12, borderRadius: 10, marginTop: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 16 },
});
