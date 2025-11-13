// ==========================================================
// INSQUIZ - ResultScreen (corregido con animación sobre 500)
// ==========================================================
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function ResultScreen({ route, navigation }) {
  const { score = 0, total = 0, area = "Práctica" } = route.params || {};

  const safeTotal = total > 0 ? total : 1;
  const percentage = (score / safeTotal) * 100;
  const scaledScore = Math.round((score / safeTotal) * 500);

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: percentage,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  // Círculo animado (por porcentaje)
  const strokeDasharray = 2 * Math.PI * 80;
  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [strokeDasharray, 0],
  });

  return (
    <LinearGradient colors={["#4A148C", "#b40000"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
        <Text style={styles.title}>Resultado de {area}</Text>

        {/* Círculo de animación */}
        <View style={styles.chartContainer}>
          <Svg width="200" height="200" viewBox="0 0 200 200">
            <Defs>
              <SvgGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#8e24aa" />
                <Stop offset="100%" stopColor="#b40000" />
              </SvgGradient>
            </Defs>

            {/* Fondo gris */}
            <Circle cx="100" cy="100" r="80" stroke="#eee" strokeWidth="12" fill="none" />

            {/* Progreso animado */}
            <AnimatedCircle
              cx="100"
              cy="100"
              r="80"
              stroke="url(#grad)"
              strokeWidth="12"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
            />
          </Svg>

          {/* Texto de puntaje */}
          <Animated.Text style={styles.percentageText}>
            {Math.round(scaledScore)} / 500
          </Animated.Text>
        </View>

        <Text style={styles.resultText}>
          Obtuviste {score} de {total} preguntas correctas
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
          <Ionicons name="home-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Volver al inicio</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { justifyContent: "center", alignItems: "center", paddingVertical: 40, flexGrow: 1 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    width: "85%",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#6a0dad", marginBottom: 20 },
  chartContainer: { alignItems: "center", justifyContent: "center" },
  percentageText: {
    position: "absolute",
    fontSize: 28,
    fontWeight: "800",
    color: "#6a0dad",
    textAlign: "center",
  },
  resultText: { fontSize: 16, color: "#444", marginVertical: 16, textAlign: "center" },
  button: {
    flexDirection: "row",
    backgroundColor: "#6a0dad",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#fff", marginLeft: 8, fontWeight: "600", fontSize: 16 },
});
