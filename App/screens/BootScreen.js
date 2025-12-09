// App/screens/BootScreen.js
// ==========================================================
//      INSQUIZ - BootScreen PREMIUM (Edición 2025)
//      Ahora registra actualizaciones OTA y notifica en Home
// ==========================================================

import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";

import { useLicense } from "../context/LicenseContext";
import { useOffline } from "../context/OfflineContext";

export default function BootScreen() {
  const navigation = useNavigation();
  const { loadLicenseFromStorage, licenseStatus } = useLicense();
  const { isConnected, checking } = useOffline();

  const animLogo = useRef(new Animated.Value(0)).current;
  const animProgress = useRef(new Animated.Value(0)).current;
  const animFade = useRef(new Animated.Value(0)).current;

  const [status, setStatus] = useState("Iniciando…");

  // ============================
  // 🎯 Función: Guardar info de update
  // ============================
  async function writeUpdateInfo(info) {
    await AsyncStorage.setItem("updateAvailable", "true");
    await AsyncStorage.setItem("updateMessage", info);
  }

  // ============================
  // 🎯 Animaciones
  // ============================
  function animateIntro() {
    Animated.parallel([
      Animated.timing(animFade, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animLogo, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }

  function animateProgress(to) {
    Animated.timing(animProgress, {
      toValue: to,
      duration: 450,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }

  // ============================
  // 🎯 Check de actualizaciones OTA silenciosas
  // ============================
  async function checkUpdatesSilent() {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        // Guarda la info para HomeScreen
        await writeUpdateInfo(
          `Actualización aplicada: ${new Date().toLocaleString()}`
        );

        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (e) {
      console.log("OTA Error:", e);
    }
  }

  // ============================
  // 🎯 Flujo principal
  // ============================
  useEffect(() => {
    animateIntro();

    async function boot() {
      setStatus("Buscando actualizaciones…");
      animateProgress(15);

      await checkUpdatesSilent();

      // Conexión offline → va a OfflineScreen
      if (!isConnected) {
        navigation.reset({
          index: 0,
          routes: [{ name: "OfflineScreen" }],
        });
        return;
      }

      setStatus("Validando licencia…");
      animateProgress(50);

      await loadLicenseFromStorage();
    }

    boot();
  }, [isConnected]);

  // ============================
  // 🎯 Reaccionar a cambios de licencia
  // ============================
  useEffect(() => {
    if (checking) return;
    if (!isConnected) return;

    if (licenseStatus === "invalid" || licenseStatus === "device_blocked") {
      setStatus("Licencia requerida");
      animateProgress(100);

      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "LicenseScreen" }],
        });
      }, 500);
      return;
    }

    if (licenseStatus === "active") {
      setStatus("Iniciando…");
      animateProgress(100);

      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "MainApp" }],
        });
      }, 600);
    }
  }, [licenseStatus, checking, isConnected]);

  // ============================
  // 🎨 Estilos animados
  // ============================
  const logoStyle = {
    opacity: animLogo,
    transform: [
      {
        translateY: animLogo.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  };

  const fadeStyle = { opacity: animFade };
  const progressWidth = animProgress.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Image
          source={require("../../assets/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.Text style={[styles.status, fadeStyle]}>
        {status}
      </Animated.Text>

      <View style={styles.progressBack}>
        <Animated.View
          style={[styles.progressFill, { width: progressWidth }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6a0dad",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 160,
    height: 160,
    marginBottom: 30,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  status: {
    marginTop: 10,
    color: "#f5e6ff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  progressBack: {
    width: "80%",
    height: 18,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 12,
    marginTop: 25,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
  },
});
