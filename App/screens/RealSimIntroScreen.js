// ==========================================================
// INSQUIZ — RealSimIntroScreen
// ==========================================================

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet
} from "react-native";

import RealSimEngine from "../engines/RealSimEngine";
import insquizMaster from "../data/converted_questions/insquiz_master";

export default function RealSimIntroScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [canStart, setCanStart] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function check() {
      try {
        const state = await RealSimEngine.StateStore.loadRealSimState();

        // si hay sesión en progreso → reanudar
        if (state && !state.completed) {
          navigation.replace("RealSimExam");
          return;
        }

        const allowed = await RealSimEngine.History.canStartRealSimToday();
        if (!mounted) return;
        setCanStart(allowed);
      } catch (e) {
        console.error("Error verificando RealSim:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    check();
    return () => { mounted = false; };
  }, []);

  async function startRealSim() {
    try {
      setLoading(true);

      if (!Array.isArray(insquizMaster) || insquizMaster.length === 0) {
        throw new Error("Banco de preguntas no disponible");
      }

      // reset explícito de memoria por consistencia
      global.__REALSIM_EXAM__ = null;

      const examPack = RealSimEngine.assembleRealSim({
        bank: insquizMaster,
        recentQuestionIds: [],
        seed: Date.now(),
      });

      global.__REALSIM_EXAM__ = examPack;

      const state = RealSimEngine.StateStore.createInitialState(examPack);
      await RealSimEngine.StateStore.saveRealSimState(state);

      navigation.replace("RealSimExam");
    } catch (e) {
      console.error("Error iniciando RealSim:", e);
      Alert.alert("Error", "No fue posible iniciar el simulacro. Inténtelo nuevamente.");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Simulacro Real – InsQUIZ</Text>

      <Text style={styles.text}>
        Este simulacro está diseñado para{" "}
        <Text style={styles.bold}>
          prepararte a las condiciones académicas del ICFES Saber 11
        </Text>
        . Evalúa tu desempeño de forma integral.
      </Text>

      <View style={styles.box}>
        <Text style={styles.item}>• Total de preguntas: 254</Text>
        <Text style={styles.item}>• Número de sesiones: 2</Text>
        <Text style={styles.item}>• Duración por sesión: 4 horas 30 minutos</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.bold}>Antes de comenzar:</Text>
        <Text style={styles.item}>• Las justificaciones se muestran al finalizar.</Text>
        <Text style={styles.item}>• Si usted sale voluntariamente, el simulacro se reinicia.</Text>
        <Text style={styles.item}>• Si completa el 100%, podrá realizar otro simulacro mañana.</Text>
        <Text style={styles.item}>• Si sale antes del 70%, puede repetir.</Text>
      </View>

      {canStart ? (
        <TouchableOpacity style={styles.primaryBtn} onPress={startRealSim}>
          <Text style={styles.primaryText}>Iniciar simulacro</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.cooldownBox}>
          <Text style={styles.bold}>Simulacro no disponible por el momento</Text>
          <Text style={styles.text2}>
            Lo sentimos, usted debe esperar hasta mañana para poder realizar otro simulacro real.
            Agradecemos su comprensión.
          </Text>
        </View>
      )}

        <TouchableOpacity style={styles.secundaryBtn} onPress={() => navigation.replace("HomeScreen")}> 
          <Text style={styles.primaryText}>Volver atras</Text>
        </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", color: "#6a0dad", marginBottom: 12 },
  text: { color: "#222", lineHeight: 20, marginBottom: 16 },
  text2: { color: "#333", lineHeight: 20, marginTop: 6 },
  bold: { fontWeight: "700" },
  box: { backgroundColor: "#f6f6fb", borderRadius: 12, padding: 12, marginBottom: 14 },
  item: { color: "#333", marginTop: 3 },
  primaryBtn: { backgroundColor: "#6a0dad", paddingVertical: 14, borderRadius: 12, alignItems: "center" },
  secundaryBtn: { backgroundColor: "#a753e2ff", paddingVertical: 14, marginTop: 12, borderRadius: 30,  alignItems: "center" },
  primaryText: { color: "#fff", fontWeight: "800" },
  cooldownBox: { backgroundColor: "#fff6f6", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#ffd6d6" },
  back: { color: "#777" },
});
