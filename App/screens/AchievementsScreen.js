// App/screens/AchievementsScreen.js
// ==========================================================
// INSQUIZ - AchievementsScreen (Dashboard Final Unificado)
// ==========================================================
// Muestra estadísticas globales, por materia y por modo.
// Incluye animaciones, gráfico circular, barras dinámicas y
// sincronización con statsService y adaptiveService.
// ==========================================================

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { ProgressBar } from "react-native-paper";
import { PieChart } from "react-native-chart-kit";
import { getStats, resetStats } from "../services/statsService";
import { getAdaptiveStats, resetAdaptiveStats } from "../services/adaptiveService";

export default function AchievementsScreen() {
  const [stats, setStats] = useState(null);
  const [adaptive, setAdaptive] = useState(null);
  const [animatedValue] = useState(new Animated.Value(0));

  // ==========================================================
  // Carga de datos
  // ==========================================================
  useEffect(() => {
    (async () => {
      const general = await getStats();
      const adapt = await getAdaptiveStats();
      setStats(general);
      setAdaptive(adapt);
    })();

    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleResetAll = async () => {
    await resetStats();
    await resetAdaptiveStats();
    setStats(null);
    setAdaptive(null);
  };

  // ==========================================================
  // Datos generales y porcentajes
  // ==========================================================
  const totalAnswered = stats?.totalAnswered || 0;
  const totalCorrect = stats?.totalCorrect || 0;
  const totalWrong = totalAnswered - totalCorrect;
  const overallProgress = totalAnswered ? totalCorrect / totalAnswered : 0;

  const adaptiveProgress =
    adaptive && adaptive.totalQuestions
      ? adaptive.totalScore / adaptive.totalQuestions
      : 0;

  const subjectStats = stats?.subjects || {};
  const SUBJECT_NAMES = {
    lectura: "Lectura Crítica",
    matematicas: "Matemáticas",
    sociales: "Sociales",
    naturales: "Ciencias Naturales",
    ingles: "Inglés",
  };

  const fadeAnim = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  const chartData =
    totalAnswered > 0
      ? [
          {
            name: "Correctas",
            population: totalCorrect,
            color: "#6a0dad",
            legendFontColor: "#222",
            legendFontSize: 14,
          },
          {
            name: "Incorrectas",
            population: totalWrong,
            color: "#ff595e",
            legendFontColor: "#222",
            legendFontSize: 14,
          },
        ]
      : [];

  const screenWidth = Dimensions.get("window").width - 32;

  // ==========================================================
  // Render
  // ==========================================================
  if (!stats && !adaptive) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Cargando estadísticas...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* ========================================================= */}
      {/* ENCABEZADO GENERAL */}
      {/* ========================================================= */}
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.header}>🏆 Resumen General</Text>
        <Text style={styles.label}>Total respondidas:</Text>
        <Text style={styles.value}>{totalAnswered}</Text>

        <Text style={styles.label}>Correctas:</Text>
        <Text style={styles.value}>{totalCorrect}</Text>

        <Text style={styles.label}>Porcentaje de aciertos:</Text>
        <ProgressBar
          progress={overallProgress}
          color="#6a0dad"
          style={styles.progressBar}
        />
        <Text style={styles.percent}>{Math.round(overallProgress * 100)}%</Text>

        {/* Gráfico circular */}
        {chartData.length > 0 && (
          <View style={styles.chartBox}>
            <PieChart
              data={chartData}
              width={screenWidth}
              height={180}
              chartConfig={{
                color: () => "#6a0dad",
                backgroundGradientFrom: "#fafafa",
                backgroundGradientTo: "#fafafa",
                decimalPlaces: 0,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="12"
            />
          </View>
        )}

        <Text style={styles.label}>Habilidad destacada:</Text>
        <Text style={styles.skill}>
          {stats?.bestSkill || "Sin datos aún"}
        </Text>
      </Animated.View>

      {/* ========================================================= */}
      {/* PROGRESO POR MATERIA */}
      {/* ========================================================= */}
      <Text style={[styles.header, { color: "#4e148c" }]}>📚 Progreso por Materia</Text>

      {Object.keys(SUBJECT_NAMES).map((key, idx) => {
        const subject = subjectStats[key] || { correct: 0, total: 0 };
        const progress = subject.total ? subject.correct / subject.total : 0;
        return (
          <Animated.View
            key={idx}
            style={[
              styles.subjectCard,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.subjectName}>{SUBJECT_NAMES[key]}</Text>
            <ProgressBar
              progress={progress}
              color="#4e148c"
              style={styles.subjectProgress}
            />
            <Text style={styles.percentText}>
              {subject.correct}/{subject.total} correctas (
              {Math.round(progress * 100)}%)
            </Text>
          </Animated.View>
        );
      })}

      {/* ========================================================= */}
      {/* DESEMPEÑO POR MODO DE JUEGO */}
      {/* ========================================================= */}
      <Text style={[styles.header, { color: "#222" }]}>⚙️ Por Modo de Juego</Text>
      <View style={styles.card}>
        {stats?.modes ? (
          Object.entries(stats.modes).map(([mode, data], i) => {
            const label =
              mode === "practice"
                ? "Modo Práctica"
                : mode === "realsim"
                ? "Simulacros"
                : "Adaptativo";
            const progress = data.total ? data.correct / data.total : 0;
            const color =
              mode === "practice"
                ? "#6a0dad"
                : mode === "realsim"
                ? "#ffb703"
                : "#0096c7";

            return (
              <View key={i} style={{ marginBottom: 10 }}>
                <Text style={styles.label}>{label}</Text>
                <ProgressBar progress={progress} color={color} style={styles.progressBar} />
                <Text style={styles.percent}>
                  {data.correct}/{data.total} correctas ({Math.round(progress * 100)}%)
                </Text>
              </View>
            );
          })
        ) : (
          <Text style={styles.emptyText}>Sin datos registrados.</Text>
        )}
      </View>

      {/* ========================================================= */}
      {/* MODO ADAPTATIVO DETALLADO */}
      {/* ========================================================= */}
      <Text style={[styles.header, { color: "#0077b6" }]}>🧠 Modo Adaptativo</Text>
      {adaptive ? (
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          <Text style={styles.label}>Sesiones completadas:</Text>
          <Text style={styles.value}>{adaptive.sessions || 0}</Text>

          <Text style={styles.label}>Preguntas totales:</Text>
          <Text style={styles.value}>{adaptive.totalQuestions || 0}</Text>

          <Text style={styles.label}>Aciertos totales:</Text>
          <Text style={styles.value}>{adaptive.totalScore || 0}</Text>

          <Text style={styles.label}>Promedio global:</Text>
          <ProgressBar
            progress={adaptiveProgress}
            color="#0096c7"
            style={styles.progressBar}
          />
          <Text style={styles.percent}>
            {Math.round(adaptiveProgress * 100)}%
          </Text>

          {adaptive.lastResult && (
            <View style={styles.lastSession}>
              <Text style={styles.label}>Última sesión:</Text>
              <Text style={styles.small}>
                {adaptive.lastResult.score} / {adaptive.lastResult.total} correctas
              </Text>
              <Text style={styles.small}>
                {new Date(adaptive.lastResult.date).toLocaleString()}
              </Text>
            </View>
          )}
        </Animated.View>
      ) : (
        <View style={styles.cardEmpty}>
          <Text style={styles.emptyText}>Aún no hay sesiones adaptativas.</Text>
        </View>
      )}

      {/* ========================================================= */}
      {/* BOTONES DE RESET */}
      {/* ========================================================= */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#6a0dad" }]}
        onPress={async () => {
          await resetAdaptiveStats();
          setAdaptive(null);
        }}
      >
        <Text style={styles.buttonText}>🔄 Reiniciar Adaptativo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#333" }]}
        onPress={handleResetAll}
      >
        <Text style={styles.buttonText}>🗑️ Reiniciar Todo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ==========================================================
// ESTILOS
// ==========================================================
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fafafa" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 20, fontWeight: "bold", marginVertical: 10, color: "#6a0dad" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  cardEmpty: {
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
  },
  emptyText: { color: "#777", fontStyle: "italic" },
  label: { color: "#444", fontSize: 15, marginTop: 6 },
  value: { fontWeight: "bold", fontSize: 16, color: "#222" },
  skill: { fontSize: 16, color: "#6a0dad", fontWeight: "600", marginTop: 4 },
  progressBar: { height: 8, borderRadius: 4, marginTop: 6 },
  percent: { textAlign: "right", color: "#666", marginBottom: 8 },
  subjectCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  subjectName: { fontWeight: "600", fontSize: 16, marginBottom: 4, color: "#4e148c" },
  subjectProgress: { height: 8, borderRadius: 4, marginBottom: 4 },
  percentText: { fontSize: 13, color: "#555", textAlign: "right" },
  chartBox: { marginTop: 10, alignItems: "center" },
  lastSession: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#eee" },
  small: { color: "#555", fontSize: 13, marginTop: 2 },
  button: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  title: { fontSize: 18, fontWeight: "bold", color: "#6a0dad" },
});
