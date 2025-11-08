// ==========================================================
// INSQUIZ - Simulacro Real (con contextos + SafeAreaView)
// ==========================================================
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
  SafeAreaView,
  Animated,
  Vibration,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getSimulacroReal, TIEMPO_POR_PREGUNTA } from "../services/realSimService";
import { saveQuizResult } from "../services/resultService";
import * as Animatable from "react-native-animatable";

// ✅ datasets de contexto
import textos_lectura from "../data/textos/textos_lectura.json";
import textos_matematicas from "../data/textos/textos_matematicas.json";
import textos_ciencias_sociales from "../data/textos/textos_ciencias_sociales.json";
import textos_ciencias_naturales from "../data/textos/textos_ciencias_naturales.json";
import textos_ingles from "../data/textos/textos_ingles.json";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function RealSimScreen({ navigation }) {
  const [preguntas, setPreguntas] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showJustification, setShowJustification] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [contextoReal, setContextoReal] = useState({ title: "", text: "" });

  // ==========================================================
  // 🔹 Cargar preguntas del simulacro
  // ==========================================================
  useEffect(() => {
    (async () => {
      try {
        const qs = await getSimulacroReal();
        if (qs && qs.length > 0) {
          setPreguntas(qs);
          setTiempoRestante(qs.length * TIEMPO_POR_PREGUNTA);
        } else {
          // no questions found
          // console.warn("No se pudieron cargar preguntas del simulacro.");
        }
      } catch (e) {
        // console.warn("Error cargando simulacro:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ==========================================================
  // 🔹 Cronómetro global
  // ==========================================================
  useEffect(() => {
    if (loading || tiempoRestante <= 0) return;
    const timer = setInterval(() => {
      setTiempoRestante((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [loading, tiempoRestante]);

  // ==========================================================
  // 🔹 Buscar contexto
  // ==========================================================
  useEffect(() => {
    if (!preguntas.length) return;
    const pregunta = preguntas[index];
    if (!pregunta) return;

    const rawContext = (pregunta.context || "").trim();
    const id = (pregunta.id || "").toUpperCase();
    const prefix = id.split("-")[0];

    let dataset = [];
    switch (prefix) {
      case "LQ":
      case "LE":
        dataset = textos_lectura;
        break;
      case "MT":
        dataset = textos_matematicas;
        break;
      case "CS":
        dataset = textos_ciencias_sociales;
        break;
      case "CN":
        dataset = textos_ciencias_naturales;
        break;
      case "EN":
        dataset = textos_ingles;
        break;
      default:
        dataset = [];
    }

    const found = dataset.find(
      (ctx) =>
        ctx.context_title?.toLowerCase().includes(rawContext.toLowerCase()) ||
        ctx.context_text?.toLowerCase().includes(rawContext.toLowerCase())
    );

    if (found) {
      setContextoReal({
        title: found.context_title || "Contexto",
        text: found.context_text || "",
      });
    } else {
      setContextoReal({ title: "", text: "" });
    }
    setExpanded(false);
  }, [index, preguntas]);

  // ==========================================================
  // 🔹 Formato de tiempo
  // ==========================================================
  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  // ==========================================================
  // 🔹 Lógica principal
  // ==========================================================
  const pregunta = preguntas[index];

  const handleSelect = (opt) => {
    if (selected) return;
    setSelected(opt);
    const isCorrect = opt.trim().startsWith(pregunta.answer?.trim());
  if (isCorrect) setScore((s) => s + 1);
    setShowJustification(false);
    anim.setValue(0);

    if (!isCorrect && Vibration && Vibration.vibrate) {
      try { Vibration.vibrate(50); } catch (e) { /* ignore */ }
    }

    Animated.timing(anim, { toValue: 1, duration: 350, useNativeDriver: false }).start(() => {
      setShowJustification(true);
    });
  };

  const siguiente = () => {
    if (index + 1 < preguntas.length) {
      setSelected(null);
      setExpanded(false);
      setIndex(index + 1);
    } else {
      terminarSimulacro();
    }
  };

  const terminarSimulacro = async () => {
    const total = preguntas?.length || 1;
    const porcentaje = (score / total) * 100;
    const scaledScore = Math.round((score / total) * 500);

    await saveQuizResult({
      area: "Simulacro Real",
      score,
      total,
      scaledScore,
      percentage: Math.round(porcentaje),
      mode: "real",
      date: new Date().toISOString(),
    });

    navigation.navigate("Result", { score, total, area: "Simulacro Real" });
  };

  // ==========================================================
  // 🔹 Render
  // ==========================================================
  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6a0dad" />
        <Text style={styles.loading}>Cargando Simulacro Real...</Text>
      </View>
    );

  if (!pregunta)
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>No hay preguntas disponibles.</Text>
      </View>
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#4A148C" }}>
      <LinearGradient colors={["#4A148C", "#b40000"]} style={{ flex: 1 }}>
        {/* Timer seguro dentro del SafeArea */}
        <View style={styles.timerBox}>
          <Text style={styles.timerText}>⏱ {formatTime(tiempoRestante)}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.header}>
            Pregunta {index + 1} / {preguntas.length}
          </Text>

          <Animatable.View animation="fadeInUp" duration={400} style={styles.card}>
            {/* CONTEXTO */}
            {contextoReal.text && contextoReal.text.trim().length > 10 && (
              <LinearGradient
                colors={["#f3e5f5cc", "#ffffffee"]}
                style={styles.contextBox}
              >
                <Text style={styles.contextTitle}>
                  {contextoReal.title || "Contexto"}
                </Text>
                <Animatable.View
                  animation={expanded ? "fadeInDown" : "fadeInUp"}
                  duration={300}
                >
                  <Text
                    style={styles.contextText}
                    numberOfLines={expanded ? undefined : 5}
                    ellipsizeMode="tail"
                  >
                    {contextoReal.text}
                  </Text>
                </Animatable.View>
                {contextoReal.text.length > 250 && (
                  <TouchableOpacity
                    onPress={() => {
                      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                      setExpanded(!expanded);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.expandButton}>
                      {expanded ? "▲ Ver menos" : "▼ Ver más"}
                    </Text>
                  </TouchableOpacity>
                )}
              </LinearGradient>
            )}

            {/* PREGUNTA */}
            <Text style={styles.question}>{pregunta.question}</Text>

            {/* OPCIONES */}
            {(pregunta.options || []).map((opt, i) => {
              const isSelected = selected === opt;
              const isCorrect = opt.trim().startsWith(pregunta.answer?.trim());

              if (isSelected) {
                const bg = anim.interpolate({ inputRange: [0, 1], outputRange: ["#fff", isCorrect ? "#4caf50" : "#f44336"] });
                const border = anim.interpolate({ inputRange: [0, 1], outputRange: ["#ccc", isCorrect ? "#4caf50" : "#f44336"] });
                const textColor = anim.interpolate({ inputRange: [0, 1], outputRange: ["#333", "#fff"] });
                return (
                  <Animated.View key={i} style={[styles.option, { backgroundColor: bg, borderColor: border }]}>
                    <TouchableOpacity onPress={() => handleSelect(opt)} disabled={!!selected}>
                      <Animated.Text style={[styles.optionText, { color: textColor }]}>{opt}</Animated.Text>
                    </TouchableOpacity>
                  </Animated.View>
                );
              }

              return (
                <TouchableOpacity key={i} style={[styles.option, { backgroundColor: "#fff", borderColor: "#ccc" }]} onPress={() => handleSelect(opt)} disabled={!!selected}>
                  <Text style={[styles.optionText, { color: "#333" }]}>{opt}</Text>
                </TouchableOpacity>
              );
            })}

            {/* BOTÓN SIGUIENTE */}
            {showJustification && (
              <View style={styles.justBox}>
                <Text style={styles.justTitle}>Justificación</Text>
                <Text style={styles.justText}>{pregunta.justification || ""}</Text>
              </View>
            )}

            {showJustification && (
              <TouchableOpacity style={styles.nextBtn} onPress={siguiente}>
                <LinearGradient colors={["#8e24aa", "#6a0dad"]} style={styles.btnGrad}>
                  <Text style={styles.btnText}>{index + 1 < preguntas.length ? "Siguiente ➜" : "Finalizar"}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </Animatable.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

// ==========================================================
// 🎨 ESTILOS
// ==========================================================
const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  timerBox: {
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  timerText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  header: { textAlign: "center", color: "#fff", fontWeight: "800", fontSize: 20 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 18, marginTop: 20 },
  contextBox: { borderRadius: 12, padding: 14, marginBottom: 15 },
  contextTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6a0dad",
    marginBottom: 6,
  },
  contextText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    textAlign: "justify",
  },
  expandButton: {
    textAlign: "center",
    color: "#6a0dad",
    fontWeight: "600",
    marginTop: 8,
  },
  question: { fontSize: 18, fontWeight: "700", marginVertical: 15 },
  option: { borderWidth: 1.3, borderRadius: 12, padding: 12, marginBottom: 10 },
  optionText: { fontSize: 16, fontWeight: "500" },
  nextBtn: { marginTop: 20, borderRadius: 10, overflow: "hidden" },
  btnGrad: { paddingVertical: 14, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loading: { color: "#333", fontSize: 18, marginTop: 10 },
  justBox: { marginTop: 12, backgroundColor: "#fff", padding: 12, borderRadius: 8 },
  justTitle: { fontWeight: "700", marginBottom: 6 },
  justText: { color: "#333" },
});
