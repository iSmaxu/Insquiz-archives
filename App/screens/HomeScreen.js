// App/screens/HomeScreen.js
// =====================================================
// INSQUIZ — HomeScreen (ESTABLE · EXPO GO)
// ✔ Perfil XP
// ✔ Release notes por OTA (1 sola vez)
// ✔ Logs claros
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

import { XP_GetProfile } from "../engines/XP_Engine";
import masterQuestions from "../data/insquiz_master";
import BuildInfo from "../components/BuildInfo";

// 🔥 Release system
import { checkAndShowReleaseMessage } from "../services/releaseService";

export default function HomeScreen() {
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);

  // ======================================================
  // 🎯 EFECTO PRINCIPAL
  // ======================================================
  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function runChecks() {
        console.log("========================================");
        console.log("🏠 HomeScreen → runChecks()");
        console.log("========================================");

        // 1️⃣ Perfil XP
        try {
          console.log("📘 Cargando perfil XP...");
          const p = await XP_GetProfile();
          if (active) setProfile(p);
          console.log("✔ Perfil XP:", p);
        } catch (e) {
          console.log("❌ Error XP_GetProfile:", e);
        }

        // 2️⃣ Release notes (OTA)
        await checkAndShowReleaseMessage();

        console.log("========================================");
        console.log("🏁 HomeScreen → FIN");
        console.log("========================================");
      }

      runChecks();

      return () => {
        active = false;
      };
    }, [])
  );

  // ======================================================
  // 🎯 SIMULACRO REAL
  // ======================================================
  const handleRealSimAlert = () => {
    Alert.alert(
      "Simulacro Real",
      "• 254 preguntas consecutivas\n• No se puede pausar\n• Requiere concentración\n\n¿Deseas comenzar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Iniciar",
          onPress: () => {
            const qs = masterQuestions
              .slice()
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
  // 🎨 UI
  // ======================================================
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>InsQUIZ</Text>
        <Text style={styles.subtitle}>
          Entrena. Mejora. Domina el examen.
        </Text>
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

      <TouchableOpacity
        style={styles.mainButton}
        onPress={handleRealSimAlert}
      >
        <Ionicons name="timer-outline" size={30} color="#fff" />
        <View style={styles.textContainer}>
          <Text style={styles.buttonTitle}>Simulacro real</Text>
          <Text style={styles.buttonDesc}>
            Examen completo tipo ICFES
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("Achievements")}
      >
        <Ionicons name="trophy-outline" size={26} color="#6a0dad" />
        <Text style={styles.secondaryText}>Ver mis logros</Text>
      </TouchableOpacity>

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
