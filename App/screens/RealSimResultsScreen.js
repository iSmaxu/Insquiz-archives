// ==========================================================
// INSQUIZ — RealSimResultsScreen
// ==========================================================

import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

import RealSimEngine from "../engines/RealSimEngine";

export default function RealSimResultsScreen({ navigation }) {
  const [report, setReport] = useState(null);

  useEffect(() => {
    async function load() {
      const pack = global.__REALSIM_EXAM__;
      const state = await RealSimEngine.StateStore.loadRealSimState();

      if (!pack || !state || !state.completed) {
        navigation.replace("Home");
        return;
      }

      const r = RealSimEngine.scoreRealSim({ examPack: pack, state });
      setReport(r);

      // limpiar state al terminar (ya quedó el intento en History)
      await RealSimEngine.StateStore.clearRealSimState();
      global.__REALSIM_EXAM__ = null;
    }

    load();
  }, []);

  if (!report) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#555" }}>Cargando resultados…</Text>
      </View>
    );
  }

  const labels = {
    lectura_critica: "Lectura crítica",
    matematicas: "Matemáticas",
    ciencias_sociales: "Sociales y ciudadanas",
    ciencias_naturales: "Ciencias naturales",
    ingles: "Inglés",
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Resultados — Simulacro Real</Text>

      <View style={styles.card}>
        <Text style={styles.big}>{report.summary.pct}%</Text>
        <Text style={styles.sub}>
          Correctas: {report.summary.correct} / {report.summary.total}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Desempeño por área</Text>
        {Object.entries(report.subjects).map(([k, v]) => (
          <View key={k} style={styles.row}>
            <Text style={styles.left}>{labels[k] || k}</Text>
            <Text style={styles.right}>{v.pct}%</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.btn} onPress={() => navigation.replace("Home")}>
        <Text style={styles.btnText}>Volver a la pantalla principal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "900", color: "#6a0dad", marginBottom: 12 },
  card: { backgroundColor: "#f6f6fb", borderRadius: 14, padding: 14, marginBottom: 12 },
  big: { fontSize: 38, fontWeight: "900", color: "#111" },
  sub: { marginTop: 6, color: "#555" },
  section: { fontWeight: "900", color: "#333", marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  left: { color: "#333" },
  right: { fontWeight: "900", color: "#6a0dad" },
  btn: { marginTop: 10, backgroundColor: "#6a0dad", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "900" },
});
