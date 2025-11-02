// App/screens/RealSimReviewScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { ProgressBar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Pantalla de revisión post-simulacro
 * Muestra preguntas, respuestas del usuario, correctas y justificación
 */
export default function RealSimReviewScreen({ navigation }) {
  const [preguntas, setPreguntas] = useState([]);
  const [estadisticas, setEstadisticas] = useState({ total: 0, correctas: 0, incorrectas: 0 });

  useEffect(() => {
    cargarRespuestas();
  }, []);

  async function cargarRespuestas() {
    try {
      const stored = await AsyncStorage.getItem("simulacroReview");
      if (stored) {
        const data = JSON.parse(stored);
        setPreguntas(data);
        const correctas = data.filter((p) => p.isCorrect).length;
        setEstadisticas({
          total: data.length,
          correctas,
          incorrectas: data.length - correctas,
        });
      }
    } catch (e) {
      console.error("Error cargando revisión:", e);
    }
  }

  if (!preguntas.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>No hay simulacros recientes 😅</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#6a0dad" }]}
          onPress={() => navigation.navigate("RealSim")}
        >
          <Text style={styles.buttonText}>Ir al simulacro real</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { total, correctas, incorrectas } = estadisticas;
  const porcentaje = total > 0 ? Math.round((correctas / total) * 100) : 0;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📘 Revisión del Simulacro</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>Total preguntas: {total}</Text>
        <Text style={styles.summaryText}>Correctas: {correctas}</Text>
        <Text style={styles.summaryText}>Incorrectas: {incorrectas}</Text>
        <Text style={styles.summaryText}>Efectividad: {porcentaje}%</Text>
        <ProgressBar
          progress={porcentaje / 100}
          color={porcentaje > 70 ? "#4caf50" : porcentaje > 50 ? "#ffb300" : "#f44336"}
          style={{ height: 10, borderRadius: 8, marginTop: 6 }}
        />
      </View>

      {preguntas.map((q, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.question}>
            {i + 1}. {q.pregunta || q.question}
          </Text>

          {q.opciones?.map((opt, j) => {
            const isCorrect = opt === (q.correcta || q.answer);
            const isSelected = opt === q.userAnswer;
            let bg = "#f7f7f7";
            if (isSelected && isCorrect) bg = "#c8f7c5";
            else if (isSelected && !isCorrect) bg = "#f8d7da";
            else if (isCorrect) bg = "#e0f7e9";

            return (
              <View key={j} style={[styles.option, { backgroundColor: bg }]}>
                <Text style={styles.optionText}>{opt}</Text>
              </View>
            );
          })}

          <View style={styles.justBox}>
            <Text style={styles.justTitle}>Justificación:</Text>
            <Text style={styles.justText}>
              {q.justificacion || "No hay justificación disponible."}
            </Text>
          </View>

          {q.skill && (
            <Text style={styles.skill}>
              🧠 Habilidad: <Text style={{ fontWeight: "bold" }}>{q.skill}</Text>
            </Text>
          )}
        </View>
      ))}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#6a0dad", marginTop: 20 }]}
        onPress={() => navigation.navigate("Achievements")}
      >
        <Text style={styles.buttonText}>Ver mis logros</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", color: "#6a0dad", marginBottom: 10, textAlign: "center" },
  summaryCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  summaryText: { fontSize: 16, color: "#444", marginVertical: 2 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  question: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 8 },
  option: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginVertical: 4,
  },
  optionText: { fontSize: 14, color: "#333" },
  justBox: {
    marginTop: 8,
    backgroundColor: "#f9f9ff",
    padding: 10,
    borderRadius: 10,
    borderColor: "#e0e0ff",
    borderWidth: 1,
  },
  justTitle: { fontWeight: "bold", color: "#6a0dad", marginBottom: 4 },
  justText: { fontSize: 14, color: "#444" },
  skill: { marginTop: 6, fontSize: 14, color: "#444", textAlign: "right" },
  button: { paddingVertical: 12, borderRadius: 10 },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold", fontSize: 16 },
});
