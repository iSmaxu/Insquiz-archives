import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

export default function InitialLoader() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6a0dad" />
      <Text style={styles.title}>Cargando preguntas...</Text>
      <Text style={styles.subtitle}>
        Esto puede demorar unos minutos mientras cargamos 10000 preguntas. Por favor espera.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#555",
    textAlign: "center",
  },
});
