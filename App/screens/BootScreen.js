import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { validateLicense } from "../services/licenseService";


export default function BootScreen() {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Iniciando...");
  const anim = useState(new Animated.Value(0))[0];

  function animateTo(val) {
    Animated.timing(anim, {
      toValue: val,
      duration: 450,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start(() => setProgress(val));
  }

  async function step(action, pct, text) {
    console.log("BOOT >>", text);
    setStatus(text);
    animateTo(pct);

    try {
      return await action();
    } catch (e) {
      console.log("BOOT ERROR >>", text, e);
      return null;
    }
  }

  async function startup() {
    await step(async () => delay(150), 10, "Cargando núcleo InsQUIZ...");

    // 🔥 VALIDACIÓN DE LICENCIA
    const lic = await step(
      () => validateLicense(),
      25,
      "Validando licencia…"
    );

    console.log("🔐 Licencia:", lic);

    if (!lic?.valid) {
      console.log("❌ Licencia inválida. Motivo:", lic?.reason);

      navigation.reset({
        index: 0,
        routes: [{ name: "LicenseGateScreen" }],
      });
      return; // DETIENE EL BOOT
    }

    await step(async () => delay(150), 40, "Verificando conexión a internet…");

  

    await step(async () => delay(200), 90, "Preparando interfaz…");
    await step(async () => delay(150), 100, "Listo…");

    navigation.reset({
      index: 0,
      routes: [{ name: "MainApp" }],
    });
  }

  useEffect(() => {
    startup();
  }, []);

  const width = anim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>InsQUIZ</Text>

      <Text style={styles.status}>{status}</Text>

      <View style={styles.barBack}>
        <Animated.View style={[styles.barFill, { width }]} />
      </View>

      <Text style={styles.percent}>{Math.round(progress)}%</Text>
    </View>
  );
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6a0dad",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 42,
    color: "white",
    fontWeight: "900",
    marginBottom: 20,
  },
  status: {
    fontSize: 17,
    color: "#f5e6ff",
    marginBottom: 25,
    textAlign: "center",
  },
  barBack: {
    width: "85%",
    height: 22,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 14,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#fff",
  },
  percent: {
    marginTop: 12,
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});
