// App/screens/DebugScreen.js
// =====================================================
// INSQUIZ — Debug Screen
// - Logs más recientes ARRIBA
// - Botón para ir al INICIO (recientes)
// - Botón para ir al FINAL (antiguos)
// =====================================================

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { subscribeLogs, clearLogs } from "../debug/ConsoleInterceptor";

export default function DebugScreen({ navigation }) {
  const [logs, setLogs] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const unsubscribe = subscribeLogs(setLogs);
    return unsubscribe;
  }, []);

  // Mostrar logs invertidos: más recientes arriba
  const formattedLogs = [...logs]
    .reverse()
    .map(
      (l) =>
        `[${l.time}] [${l.level}] ${l.message}`
    )
    .join("\n\n");

  function scrollToTop() {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }

  function scrollToBottom() {
    scrollRef.current?.scrollToEnd({ animated: true });
  }

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Debug Console</Text>

        <View style={styles.actions}>


          <TouchableOpacity
            style={styles.btn}
            onPress={scrollToTop}
            activeOpacity={0.9}
          >
            <Ionicons
              name="arrow-up-circle-outline"
              size={16}
              color="#F5F5FF"
            />
            <Text style={styles.btnText}>Ir al inicio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn}
            onPress={scrollToBottom}
            activeOpacity={0.9}
          >
            <Ionicons
              name="arrow-down-circle-outline"
              size={16}
              color="#F5F5FF"
            />
            <Text style={styles.btnText}>Ir al final</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn}
            onPress={clearLogs}
            activeOpacity={0.9}
          >
            <Ionicons name="trash" size={16} color="#F5F5FF" />
            <Text style={styles.btnText}>Limpiar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.9}
          >
            <Ionicons name="arrow-back" size={16} color="#F5F5FF" />
            <Text style={styles.btnText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CONSOLA */}
      <ScrollView
        ref={scrollRef}
        style={styles.console}
        contentContainerStyle={styles.consoleContent}
      >
        <Text style={styles.code}>
          {formattedLogs || "— No hay logs registrados —"}
        </Text>
      </ScrollView>
    </View>
  );
}

// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#050509",
  },
  header: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.12)",
  },
  title: {
    color: "#F5F5FF",
    fontSize: 18,
    fontWeight: "900",
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
  btnText: {
    color: "#F5F5FF",
    fontSize: 13,
    fontWeight: "800",
  },
  console: {
    flex: 1,
  },
  consoleContent: {
    padding: 14,
  },
  code: {
    color: "rgba(245,245,255,0.85)",
    fontSize: 12.5,
    lineHeight: 16.5,
    fontFamily: Platform.select({
      ios: "Menlo",
      android: "monospace",
      default: "monospace",
    }),
  },
});
