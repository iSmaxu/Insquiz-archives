// App/screens/ResultScreen.js
// ==========================================================
//  INSQUIZ - ResultScreen v3 (unificado + score/500)
// ==========================================================

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { calculateScore500 } from "../services/resultService";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function ResultScreen({ route, navigation }) {
  const { score = 0, total = 0, area = "Resultado", mode = "practice" } =
    route.params || {};

  const [fadeAnim] = useState(new Animated.Value(0));

  // 📌 Calcular puntaje sobre 500 (lineal)
  const score500 = calculateScore500(score, total);
  const percent = ((score / total) * 100).toFixed(1);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  // 🟣 Repetir sesión (mismo modo)
  const handleRepeat = () => {
    if (mode === "realsim") {
      return navigation.replace("RealSimScreen");
    }
    if (mode === "adaptive") {
      return navigation.replace("AdaptivePracticeScreen");
    }
    // default → practice
    navigation.goBack();
  };

  // 🟣 Revisar (solo Simulacro Real)
  const canReview = mode === "realsim";

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Encabezado */}
      <View style={styles.headerBox}>
        <Text style={styles.modeText}>{area}</Text>
        <Text style={styles.subText}>
          {mode === "realsim"
            ? "Simulacro Real"
            : mode === "adaptive"
            ? "Modo Adaptativo"
            : "Modo Práctica"}
        </Text>
      </View>

      {/* PUNTAJE SOBRE 500 */}
      <View style={styles.scoreCard}>
        <Text style={styles.score500}>{score500}</Text>
        <Text style={styles.over500}>/500</Text>
        <Text style={styles.percent}>{percent}% de acierto</Text>
      </View>

      {/* Detalles */}
      <View style={styles.detailBox}>
        <Text style={styles.detailText}>
          <Text style={styles.bold}>{score}</Text> correctas de{" "}
          <Text style={styles.bold}>{total}</Text>
        </Text>
      </View>

      {/* Botones */}
      <View style={styles.btnGroup}>
        {/* Repetir */}
        <TouchableOpacity style={styles.btnPrimary} onPress={handleRepeat}>
          <Ionicons name="refresh" size={22} color="#fff" />
          <Text style={styles.btnPrimaryText}>Repetir</Text>
        </TouchableOpacity>

        {/* Revisar */}
        {canReview && (
          <TouchableOpacity
            style={[styles.btnPrimary, { backgroundColor: "#0056b3" }]}
            onPress={() => navigation.navigate("RealSimReviewScreen")}
          >
            <MaterialCommunityIcons
              name="file-search-outline"
              size={22}
              color="#fff"
            />
            <Text style={styles.btnPrimaryText}>Revisar</Text>
          </TouchableOpacity>
        )}

        {/* Volver al inicio */}
        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "Home" }],
            })
          }
        >
          <Ionicons name="home-outline" size={22} color="#6a0dad" />
          <Text style={styles.btnSecondaryText}>Inicio</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

// ==========================================================
// 🎨 Estilos
// ==========================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    padding: 20,
    paddingTop: 70,
  },

  headerBox: {
    alignItems: "center",
    marginBottom: 25,
  },
  modeText: {
    fontSize: 26,
    fontWeight: "900",
    color: "#6a0dad",
  },
  subText: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },

  scoreCard: {
    alignItems: "center",
    backgroundColor: "#6a0dad",
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  score500: {
    fontSize: 70,
    fontWeight: "900",
    color: "#fff",
    marginBottom: -8,
  },
  over500: {
    fontSize: 22,
    color: "#e5e5e5",
    marginBottom: 8,
  },
  percent: {
    fontSize: 18,
    color: "#fff",
    opacity: 0.9,
  },

  detailBox: {
    marginTop: 26,
    alignItems: "center",
  },
  detailText: {
    fontSize: 18,
    color: "#444",
  },
  bold: {
    fontWeight: "bold",
    color: "#6a0dad",
  },

  btnGroup: {
    marginTop: 40,
    alignItems: "center",
    gap: 14,
  },

  btnPrimary: {
    backgroundColor: "#6a0dad",
    width: "75%",
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  btnPrimaryText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "700",
  },

  btnSecondary: {
    borderWidth: 2,
    borderColor: "#6a0dad",
    width: "75%",
    paddingVertical: 12,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  btnSecondaryText: {
    fontSize: 16,
    color: "#6a0dad",
    fontWeight: "700",
  },
});
