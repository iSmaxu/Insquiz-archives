// App/screens/AboutScreen.js
// ==========================================================
//  INSQUIZ - ACERCA DE / MANUAL DE USO (con ScrollWrapper)
// ==========================================================

import React from "react";
import { View, Text, StyleSheet, Linking } from "react-native";
import ScrollWrapper from "../components/ScrollWrapper"; // ← Barrita tipo Google

export default function AboutScreen() {
  return (
    <ScrollWrapper style={styles.container}>
      <Text style={styles.title}>📘 Acerca de InsQUIZ</Text>
      <Text style={styles.desc}>
        InsQUIZ es una plataforma diseñada para ayudarte a prepararte de
        manera rápida, clara y efectiva para el examen ICFES.
      </Text>

      {/* -------------------- Sección -------------------- */}
      <Section title="🏠 Inicio">
        Te permite acceder a todos los modos de práctica, simulacros, logros y tu rendimiento general.
      </Section>

      <Section title="🧠 Práctica por áreas">
        Practica preguntas seleccionando el área que deseas reforzar: Lectura Crítica, Matemáticas,
        Ciencias Naturales, Sociales o Inglés. Al finalizar podrás ver tu resultado y tu progreso.
      </Section>

      <Section title="🎯 Modo Adaptativo">
        Un modo inteligente que ajusta la dificultad automáticamente según tus aciertos y errores.
        Ideal para entrenar cuando no sabes por dónde empezar o quieres mejorar de forma constante.
      </Section>

      <Section title="📝 Simulacro Real (RealSim)">
        Un simulacro completo de 278 preguntas distribuidas igual que el examen ICFES real.
        Al finalizar podrás ver la revisión completa con todas las respuestas correctas y justificaciones.
      </Section>

      <Section title="📊 Mi Rendimiento">
        Aquí puedes ver tu nivel, experiencia (XP), racha diaria, porcentaje global de respuestas,
        áreas fuertes, áreas débiles y tu historial reciente de estudio.
      </Section>

      <Section title="🏅 Logros">
        Desbloquea logros al completar actividades como resolver preguntas, mantener rachas diarias
        o finalizar simulacros. Te ayudan a mantener la motivación.
      </Section>

      <Section title="🎮 Sistema de XP">
        Ganas experiencia al responder correctamente. Aumentar tu nivel refleja tu constancia en el estudio.
      </Section>

      <Section title="📶 Modo Offline">
        Si pierdes conexión, recibirás una notificación y tendrás 10 minutos antes de que la app te
        pida reconectar. Si estás en un quiz, podrás terminarlo sin interrupciones.
      </Section>

      <Section title="🔐 Licencias">
        InsQUIZ requiere una licencia para funcionar. Esta puede tener fecha de expiración o límite
        de dispositivos. Si algo no es válido, la app te avisará claramente.
      </Section>

      <Section title="⚙️ Configuración">
        Puedes ver tu licencia actual, buscar actualizaciones, cerrar sesión y acceder a este manual.
      </Section>

      <Section title="🕑 Actualizaciones">
        InsQUIZ se actualiza regularmente con nuevas preguntas, mejoras de rendimiento y nuevas funciones.
        Asegúrate de mantener la app actualizada para aprovechar al máximo todas sus capacidades.
      </Section>

      <Section title="⁉️ Soporte y contacto">
        Si tienes dudas, sugerencias o necesitas ayuda, puedes contactarnos a través de{" "}
        <Text
          style={{ color: "#4CAF50", textDecorationLine: "underline" }}
          onPress={() => Linking.openURL("https://wa.me/3217534005")}
        >
          nuestro número de soporte
        </Text>{" "}
        o visitar nuestra página web oficial.
      </Section>

      <Text style={styles.footer}>
        Versión 1.0 · InsQUIZ © {new Date().getFullYear()}
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
    marginBottom: 10,
  },
  desc: {
    fontSize: 14,
    color: "#444",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
    backgroundColor: "#fff",
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
  footer: {
    marginTop: 20,
    textAlign: "center",
    color: "#777",
    fontSize: 12,
    paddingBottom: 30,
  },
});
