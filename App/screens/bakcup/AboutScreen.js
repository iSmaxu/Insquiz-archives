// App/screens/AboutScreen.js
// ==========================================================
//  INSQUIZ — ACERCA DE / MANUAL DE USO (Nueva Era)
// ==========================================================

import React from "react";
import { View, Text, StyleSheet, Linking, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ScrollWrapper from "../components/ScrollWrapper";
import release from "../data/meta/release.json";


export default function AboutScreen() {
  const rawCommit = release?.commit || "";
const displayVersion = rawCommit.startsWith("I.")
  ? rawCommit.slice(2)
  : rawCommit.replace(/^I/, "");
  const navigation = useNavigation();
  return (
    <ScrollWrapper style={styles.container}>
      <Text style={styles.title}>📘 InsQUIZ</Text>
      <Text style={styles.desc}>
        InsQUIZ es una plataforma educativa diseñada para la preparación real,
        rigurosa y consciente de las Pruebas Saber 11 (ICFES).
      </Text>

      {/* -------------------- Secciones -------------------- */}

      <Section title="🎯 Propósito">
        InsQUIZ no es un juego de preguntas ni una app de estudio superficial.
        Es un sistema de entrenamiento académico que busca exponer al estudiante
        a condiciones similares a las de un examen real: exigencia, duración,
        presión y análisis posterior.
      </Section>

      <Section title="🏠 Inicio">
        Desde la pantalla principal puedes acceder a los distintos modos de
        práctica, al simulacro real, a tu progreso general y a las funciones
        principales de la aplicación.
      </Section>

      <Section title="📚 Práctica por áreas">
        Permite practicar preguntas organizadas por área:
        Lectura Crítica, Matemáticas, Ciencias Naturales, Ciencias Sociales e Inglés.
        Cada pregunta cuenta con contexto, respuesta correcta y justificación.
      </Section>

      <Section title="📝 Simulacro Real (RealSim)">
        RealSim es un simulacro extenso y exigente, diseñado para reproducir la
        experiencia de una prueba ICFES real. Evalúa no solo el conocimiento,
        sino también la resistencia mental, la gestión del tiempo y la concentración.
      </Section>

      <Section title="📖 Revisión y aprendizaje">
        Al finalizar una práctica o simulacro, puedes revisar cada pregunta con
        su justificación. El objetivo no es solo saber si acertaste, sino entender
        por qué una opción es correcta y las demás no.
      </Section>

      <Section title="🧠 Banco académico">
        InsQUIZ utiliza un banco de preguntas originales, creadas bajo criterios
        académicos estrictos. Las preguntas no provienen de exámenes reales
        filtrados ni copiados, sino que están diseñadas para entrenar habilidades
        reales evaluadas por el ICFES.
      </Section>


      <Section title="📶 Funcionamiento offline">
        InsQUIZ está diseñada bajo un enfoque offline-first. Si pierdes conexión,
        la app puede seguir funcionando durante un tiempo limitado y te permitirá
        finalizar actividades activas sin interrupciones.
      </Section>

      <Section title="🔐 Licencias">
        El uso de InsQUIZ requiere una licencia válida. Esta puede tener fecha de
        expiración, límite de dispositivos u otras condiciones. La aplicación
        notificará claramente cualquier problema relacionado con la licencia.
      </Section>

      <Section title="⚙️ Configuración">
        Desde la configuración puedes consultar tu licencia, buscar
        actualizaciones, cerrar sesión y acceder a este manual de uso.
      </Section>

      <Section title="🕑 Actualizaciones">
        InsQUIZ se encuentra en evolución constante. Las actualizaciones incluyen
        mejoras de estabilidad, optimización y expansión del contenido académico.
      </Section>

      <Section title="⁉️ Soporte">
        Si tienes dudas o necesitas asistencia, puedes comunicarte a través de{" "}
        <Text
          style={styles.link}
          onPress={() => Linking.openURL("https://wa.me/3217534005")}
        >
          nuestro canal de soporte
        </Text>

      </Section>

      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => navigation.navigate("HelpModes")}
      >
        <Text style={styles.moreButtonText}>Más sobre InsQUIZ</Text>
      </TouchableOpacity>

  <Text style={styles.footer}>
      InsQUIZ © {new Date().getFullYear()} · v{displayVersion}
  </Text>

    </ScrollWrapper>
  );
}

// ----------------------------------------------------------
// Componente reutilizable
// ----------------------------------------------------------

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionText}>{children}</Text>
    </View>
  );
}

// ==========================================================
// STYLES
// ==========================================================

const styles = StyleSheet.create({
  navigation: {
    color: "#4CAF50",
    textDecorationLine: "underline",
    fontSize: 18,
    fontWeight: "700",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fafafa",
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#6a0dad",
    textAlign: "center",
    marginBottom: 8,
  },
  desc: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 14,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#6a0dad",
    fontWeight: "800",
    marginBottom: 6,
  },
  sectionText: {
    color: "#333",
    fontSize: 14,
    lineHeight: 20,
  },
  link: {
    color: "#4CAF50",
    textDecorationLine: "underline",
  },
  moreButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  moreButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  footer: {
    marginTop: 24,
    textAlign: "center",
    color: "#777",
    fontSize: 12,
    paddingBottom: 30,
  },
});
