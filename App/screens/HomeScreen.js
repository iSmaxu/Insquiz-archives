import React from "react";
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
import { useNavigation } from "@react-navigation/native";
import * as Updates from "expo-updates";





export default function HomeScreen() {
  const navigation = useNavigation();

  // 🔥 ALERTA ANTES DEL SIMULACRO REAL
  const handleRealSimAlert = () => {
    Alert.alert(
      "Simulacro Real (390 preguntas)",
      "Estás a punto de iniciar un simulacro idéntico al examen oficial.\n\n" +
        "• Contiene 390 preguntas consecutivas.\n" +
        "• Si sales, perderás el progreso.\n" +
        "• Asegúrate de tener tiempo y un ambiente tranquilo.\n\n" +
        "¿Deseas comenzar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Iniciar",
          style: "default",
          onPress: () => navigation.navigate("RealSimScreen"),
        },
      ]
    );
  };

  // 🔄 BOTÓN PARA BUSCAR ACTUALIZACIONES OTA
  const handleOTAUpdate = async () => {
    try {
      alert("Buscando actualizaciones…");

      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        alert("Actualización disponible. Descargando…");
        await Updates.fetchUpdateAsync();
        alert("Actualización lista. Reiniciando la app…");
        await Updates.reloadAsync();
      } else {
        alert("No hay actualizaciones disponibles.");
      }
    } catch (e) {
      console.log("OTA Error >>", e);
      alert("No se pudo buscar actualizaciones.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>InsQUIZ</Text>
        <Text style={styles.subtitle}>Entrena. Mejora. Domina el examen.</Text>
      </View>

      {/* MODO PRÁCTICA */}
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

      {/* SIMULACRO REAL */}
      <TouchableOpacity style={styles.mainButton} onPress={handleRealSimAlert}>
        <Ionicons name="timer-outline" size={30} color="#fff" />
        <View style={styles.textContainer}>
          <Text style={styles.buttonTitle}>Simulacro real</Text>
          <Text style={styles.buttonDesc}>390 preguntas tipo examen</Text>
        </View>
      </TouchableOpacity>

      {/* LOGROS */}
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("Achievements")}
      >
        <Ionicons name="trophy-outline" size={26} color="#6a0dad" />
        <Text style={styles.secondaryText}>Ver mis logros</Text>
      </TouchableOpacity>

      {/* 🔄 ACTUALIZAR APP */}
      <TouchableOpacity
        style={[styles.secondaryButton, { marginTop: 15 }]}
        onPress={handleOTAUpdate}
      >
        <Ionicons name="cloud-download-outline" size={26} color="#6a0dad" />
        <Text style={styles.secondaryText}>Buscar actualizaciones</Text>
      </TouchableOpacity>

      {/* FOOTER IMAGE */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/icon.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </ScrollView>
  );
}

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
    shadowColor: "#6a0dad",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
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
  },
  secondaryText: {
    color: "#6a0dad",
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 8,
  },

  imageContainer: { alignItems: "center", marginTop: 45, marginBottom: 60 },
  image: { width: 260, height: 220 },
});
