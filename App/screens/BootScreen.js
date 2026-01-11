// App/screens/BootScreen.js
// ==========================================================
// INSQUIZ — BootScreen (LICENCIA CLÁSICA + MANTENIMIENTO + UPDATES VISIBLES)
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

  // ======================================================
  // UPDATES — AHORA CON ESTADOS VISIBLES
  // ======================================================
  async function checkUpdatesVerbose() {
    try {
      // 1) Buscar
      setStatus("Buscando actualizaciones…");
      animateProgress(10);

      const update = await Updates.checkForUpdateAsync();

      if (!update.isAvailable) {
        // No hay update
        await AsyncStorage.setItem("updateAvailable", "false");
        return { updated: false };
      }

      // Hay update
      await AsyncStorage.setItem("updateAvailable", "true");

      // 2) Descargar
      setStatus("Descargando actualización…");
      animateProgress(18);
      await Updates.fetchUpdateAsync();

      // 3) Instalar (Expo realmente “instala” al reiniciar, pero mostramos el paso)
      setStatus("Instalando actualización…");
      animateProgress(22);

      // Pequeño delay para que el usuario LO VEA
      await new Promise((r) => setTimeout(r, 700));

      // 4) Reiniciar
      setStatus("Reiniciando sistema…");
      animateProgress(25);

      await new Promise((r) => setTimeout(r, 400));

      await Updates.reloadAsync(); // no vuelve
      return { updated: true };
    } catch {
      // Si falla, seguimos el boot normal sin bloquear al usuario
      return { updated: false, error: true };
    }
  }

  useEffect(() => {
    let cancelled = false;

    animateIntro();

    async function boot() {
      if (cancelled) return;

      // ======================================================
      // 1) UPDATES (solo si hay conexión; si no, no perdemos tiempo)
      // ======================================================
      if (isConnected) {
        await checkUpdatesVerbose();
        // Si hubo update real, reloadAsync ya reinició y nunca llega aquí.
      } else {
        setStatus("Sin conexión: iniciando modo offline…");
        animateProgress(8);
        await new Promise((r) => setTimeout(r, 400));
      }

      // ======================================================
      // 2) OFFLINE GATE
      // ======================================================
      if (!isConnected && !checking) {
        navigation.reset({
          index: 0,
          routes: [{ name: "OfflineScreen" }],
        });
        return;
      }

      // ======================================================
      // 3) MANTENIMIENTO
      // ======================================================
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

      // ======================================================
      // 4) LICENCIA
      // ======================================================
      setStatus("Validando licencia…");
      animateProgress(60);

      setBootStarted(true);
      loadLicenseFromStorage();
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, [isConnected]);

  useEffect(() => {
    if (!bootStarted || licenseStatus === "checking") return;

    if (licenseStatus === "active") {
      navigation.reset({
        index: 0,
        routes: [{ name: "MainApp" }],
      });
    }

    if (licenseStatus === "invalid") {
      navigation.reset({
        index: 0,
        routes: [{ name: "LicenseScreen" }],
      });
    }
  }, [licenseStatus, bootStarted]);

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
