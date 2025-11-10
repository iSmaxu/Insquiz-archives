import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>InsQUIZ</Text>
        <Text style={styles.subtitle}>Entrena. Mejora. Supera el examen.</Text>
      </View>

      <TouchableOpacity
  style={styles.mainButton}
  onPress={() => navigation.navigate("PracticeMenuScreen")}
>
  <Ionicons name="book-outline" size={28} color="#fff" />
  <View style={styles.textContainer}>
    <Text style={styles.buttonTitle}>Modo práctica</Text>
    <Text style={styles.buttonDesc}>Ejercita tus habilidades por materia</Text>
  </View>
</TouchableOpacity>

<TouchableOpacity
  style={styles.mainButton}
  onPress={() => navigation.getParent()?.navigate("RealSimScreen")}
>
  <Ionicons name="timer-outline" size={28} color="#fff" />
  <View style={styles.textContainer}>
    <Text style={styles.buttonTitle}>Simulacro real</Text>
    <Text style={styles.buttonDesc}>Pon a prueba tu conocimiento</Text>
  </View>
</TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.getParent()?.navigate("PracticeMenuScreen")}
      >
        <Ionicons name="trophy-outline" size={26} color="#6a0dad" />
        <Text style={styles.secondaryText}>Ver mis logros</Text>
      </TouchableOpacity>

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
    padding: 25,
    alignItems: "center",
    backgroundColor: "#6a0dad",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  appTitle: { fontSize: 34, fontWeight: "900", color: "#fff", marginBottom: 5 },
  subtitle: { fontSize: 14, color: "#e0e0e0" },
  mainButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6a0dad",
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 16,
    borderRadius: 14,
  },
  textContainer: { marginLeft: 14 },
  buttonTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },
  buttonDesc: { fontSize: 13, color: "#e5e5e5" },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#6a0dad",
  },
  secondaryText: {
    color: "#6a0dad",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  imageContainer: { alignItems: "center", marginTop: 40, marginBottom: 50 },
  image: { width: 280, height: 220 },
});
