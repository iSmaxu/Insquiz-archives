// App/screens/HomeScreen.js
// =====================================================
//   INSQUIZ — HomeScreen COMPLETA con:
//   ✨ Detección OTA por commit
//   ✨ Registro de ExpoPushToken en Firebase
//   ✨ Logs detallados de depuración
// =====================================================

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";           // ✨ OTA COMMIT
import * as Updates from "expo-updates";
import * as Notifications from "expo-notifications";

import { XP_GetProfile } from "../engines/XP_Engine";
import masterQuestions from "../data/insquiz_master";
import { registerPushTokenInDB } from "../services/pushService";   // ✨ PUSH SYSTEM
import BuildInfo from "../components/BuildInfo"; // (opcional)

export default function HomeScreen() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);

  // ======================================================
  // 🎯 MAIN EFFECT — Cada vez que entras a HomeScreen
  // ======================================================
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function runChecks() {
        console.log("========================================");
        console.log("🏁 HomeScreen → runChecks() INICIADO");
        console.log("========================================");

        // 1️⃣ Obtener perfil XP
        try {
          console.log("📘 Cargando perfil XP...");
          const p = await XP_GetProfile();
          if (isActive) setProfile(p);
          console.log("✔ Perfil XP cargado:", p);
        } catch (e) {
          console.log("❌ Error cargando XP_GetProfile:", e);
        }

        // 2️⃣ Detectar si hubo OTA update usando commit
        try {
          const currentCommit = Constants.expoConfig?.extra?.commit ?? null;
          console.log("🔍 Commit actual:", currentCommit);

          if (!currentCommit) {
            console.log("⚠️ NO SE ENCONTRÓ commit. Revisa app.config.js");
          } else {
            const lastCommit = await AsyncStorage.getItem("lastCommit");
            console.log("📦 lastCommit guardado:", lastCommit);

            if (!lastCommit) {
              console.log("🟣 Guardando commit inicial...");
              await AsyncStorage.setItem("lastCommit", currentCommit);
            } else if (lastCommit !== currentCommit) {
              console.log("🎉 OTA DETECTADA → commit cambió.");
              await AsyncStorage.setItem("lastCommit", currentCommit);

              Alert.alert(
                "InsQUIZ actualizado ✨",
                `Se ha aplicado una nueva actualización.\n\nCommit: ${currentCommit}`,
                [{ text: "Entendido" }]
              );
            }
          }
        } catch (e) {
          console.log("❌ Error verificando OTA:", e);
        }

        // 3️⃣ Registrar token push en Firebase
        try {
          console.log("📣 Registrando ExpoPushToken...");
          const token = await registerPushTokenInDB();
          console.log("📣 Resultado registerPushTokenInDB:", token);
        } catch (e) {
          console.log("❌ Error registrando push token:", e);
        }

        console.log("========================================");
        console.log("🏁 HomeScreen → runChecks() FINALIZADO");
        console.log("========================================");
      }

      runChecks();

      return () => {
        isActive = false;
      };
    }, [])
  );

  // ======================================================
  // 🎯 ALERTA ANTES DEL SIMULACRO REAL
  // ======================================================
  const handleRealSimAlert = () => {
    Alert.alert(
      "Simulacro Real (240 preguntas)",
      "Estás a punto de iniciar un simulacro idéntico al examen oficial.\n\n" +
        "• Contiene 240 preguntas consecutivas.\n" +
        "• Si sales, perderás el progreso.\n" +
        "• Asegúrate de tener tiempo y concentración.\n\n" +
        "¿Deseas comenzar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Iniciar",
          style: "default",
          onPress: () => {
            const qs = masterQuestions
              .sort(() => Math.random() - 0.5)
              .slice(0, 390);

            navigation.navigate("RealSimScreen", {
              questions: qs,
              mode: "realsim",
            });
          },
        },
      ]
    );
  };

  // ======================================================
  // 🎯 UI GENERAL
  // ======================================================
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>InsQUIZ</Text>
        <Text style={styles.subtitle}>Entrena. Mejora. Domina el examen.</Text>
      </View>

      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => navigation.navigate("PracticeMenuScreen")}
      >
        <Ionicons name="book-outline" size={30} color="#fff" />
        <View style={styles.textContainer}>
          <Text style={styles.buttonTitle}>Modo práctica</Text>
          <Text style={styles.buttonDesc}>
            Ejercita tus habilidades por materia
          </Text>
        </View>
      </TouchableOpacity>

      {/* Simulacro Real */}
      <TouchableOpacity style={styles.mainButton} onPress={handleRealSimAlert}>
        <Ionicons name="timer-outline" size={30} color="#fff" />
        <View style={styles.textContainer}>
          <Text style={styles.buttonTitle}>Simulacro real</Text>
          <Text style={styles.buttonDesc}>240 preguntas tipo examen</Text>
        </View>
      </TouchableOpacity>

      {/* Logros */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("Achievements")}
      >
        <Ionicons name="trophy-outline" size={26} color="#6a0dad" />
        <Text style={styles.secondaryText}>Ver mis logros</Text>
      </TouchableOpacity>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/icon.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <BuildInfo />
    </ScrollView>
  );
}

// ======================================================
// 🎨 ESTILOS
// ======================================================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },

  header: {
    padding: 30,
    paddingTop: 55,
    alignItems: "center",
    backgroundColor: "#6a0dad",
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  appTitle: {
    fontSize: 36,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 6,
    letterSpacing: 1,
  },
  subtitle: { fontSize: 15, color: "#e0e0e0" },

  mainButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6a0dad",
    marginHorizontal: 20,
    marginVertical: 12,
    padding: 18,
    borderRadius: 16,
    elevation: 3,
  },

  textContainer: { marginLeft: 14 },
  buttonTitle: { fontSize: 19, fontWeight: "800", color: "#fff" },
  buttonDesc: { fontSize: 13, color: "#ececec", marginTop: 2 },

  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 22,
    padding: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#6a0dad",
    marginTop: 10,
  },
  secondaryText: {
    color: "#6a0dad",
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 8,
  },

  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 45,
    marginBottom: 60,
  },

  image: { width: 270, height: 230 },
});
