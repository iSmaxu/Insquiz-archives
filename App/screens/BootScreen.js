// ==========================================================
// INSQUIZ — BootScreen (LICENCIA CLÁSICA + MANTENIMIENTO)
// ==========================================================

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";

import { useLicense } from "../context/LicenseContext";
import { useOffline } from "../context/OfflineContext";
import { isMaintenanceActive } from "../services/MaintenanceService";

export default function BootScreen() {
  const navigation = useNavigation();
  const { loadLicenseFromStorage, licenseStatus } = useLicense();
  const { isConnected, checking } = useOffline();

  const animLogo = useRef(new Animated.Value(0)).current;
  const animProgress = useRef(new Animated.Value(0)).current;
  const animFade = useRef(new Animated.Value(0)).current;

  const [status, setStatus] = useState("Iniciando…");
  const [bootStarted, setBootStarted] = useState(false);

  // ============================
  // Animaciones
  // ============================
  function animateIntro() {
    Animated.parallel([
      Animated.timing(animFade, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(animLogo, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }

  function animateProgress(to) {
    Animated.timing(animProgress, {
      toValue: to,
      duration: 350,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }

  // ============================
  // OTA silencioso
  // ============================
  async function checkUpdatesSilent() {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await AsyncStorage.setItem("updateAvailable", "true");
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch {
      // Expo Go puede fallar aquí, no bloquea
    }
  }

  // ============================
  // BOOT CLÁSICO (NO decide licencia)
  // ============================
  useEffect(() => {
    let cancelled = false;

    animateIntro();

    async function boot() {
      if (cancelled) return;

      setStatus("Buscando actualizaciones…");
      animateProgress(10);
      await checkUpdatesSilent();

      if (cancelled) return;

      // Offline primero
      if (!isConnected && !checking) {
        navigation.reset({
          index: 0,
          routes: [{ name: "OfflineScreen" }],
        });
        return;
      }

      setStatus("Verificando sistema…");
      animateProgress(30);

      const maintenance = await isMaintenanceActive();
      if (maintenance) {
        navigation.reset({
          index: 0,
          routes: [{ name: "MaintenanceScreen" }],
        });
        return;
      }

      setStatus("Validando licencia…");
      animateProgress(60);

      setBootStarted(true);
      loadLicenseFromStorage(); // 🔹 como antes, SIN await
    }

    boot();

    return () => {
      cancelled = true;
    };
  }, [isConnected]);

  // ============================
  // REACCIONAR A LICENCIA (SISTEMA ANTIGUO)
  // ============================
  useEffect(() => {
    if (!bootStarted) return;

    if (licenseStatus === "checking") return;

    if (licenseStatus === "active") {
      navigation.reset({
        index: 0,
        routes: [{ name: "MainApp" }],
      });
      return;
    }

    if (licenseStatus === "invalid") {
      navigation.reset({
        index: 0,
        routes: [{ name: "LicenseScreen" }],
      });
    }
  }, [licenseStatus, bootStarted]);

  // ============================
  // UI
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
