// App/screens/CreditsScreen.js
// ================================================
// INSQUIZ - Créditos (Pantalla moderna + Scroll)
// ================================================

import React from "react";
import { View, Text, StyleSheet, ScrollView, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CreditsScreen() {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Créditos</Text>
          <Text style={styles.subtitle}>Conoce a quienes hacen posible InsQUIZ</Text>
        </View>
        {/* TARJETA PRINCIPAL */}
        <View style={styles.card}>
          <Ionicons name="people-circle-outline" size={48} color="#6a0dad" />
          <Text style={styles.cardTitle}>Empresa Desarrolladora</Text>

          <Text style={styles.line}>
            <Text style={styles.bold}>Ivan Perez tech S.A.S</Text> 
          </Text>

          
                    <Text style={styles.cardTitle}>Equipo Principal</Text>

          <Text style={styles.line}>
            <Text style={styles.bold}>CEO & Fundador:</Text> {` `}Ivan Samuel Pérez, Ivan Dario Perez.
          </Text>

          <Text style={styles.line}>
            <Text style={styles.bold}>Lead Developer:</Text> {` `}Ivan Samuel Perez Torrenegra
          </Text>

        </View>

        {/* LINKS */}
        <View style={styles.card}>
          <Ionicons name="link-outline" size={46} color="#6a0dad" />
          <Text style={styles.cardTitle}>Sitios oficiales</Text>

          <Text
            style={styles.link}
            onPress={() => Linking.openURL("https://insquiz-admin.web.app")}
          >
            Pagina WEB oficial.
          </Text>
        </View>

        <Text style={styles.footer}>© {new Date().getFullYear()} InsQUIZ.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#6a0dad",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },

  card: {
    backgroundColor: "#f6f0ff",
    padding: 20,
    borderRadius: 18,
    width: "88%",
    alignSelf: "center",
    marginTop: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#333",
    marginTop: 8,
    marginBottom: 10,
  },

  line: {
    fontSize: 15,
    color: "#444",
    marginBottom: 6,
  },
  bold: {
    fontWeight: "700",
  },

  link: {
    fontSize: 15,
    color: "#6a0dad",
    fontWeight: "600",
    marginBottom: 6,
    textDecorationLine: "underline",
  },

  footer: {
    textAlign: "center",
    color: "#aaa",
    marginTop: 30,
    marginBottom: 50,
  },
});
