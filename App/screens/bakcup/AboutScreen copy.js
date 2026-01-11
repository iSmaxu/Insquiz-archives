// App/screens/HelpModesScreen.js
// =====================================================
// INSQUIZ — Guía del usuario (MODOS + FUNCIONES + QUÉ HACER SI...)
// - Ultra completa, lenguaje humano
// - Sección técnica opcional al final
// =====================================================

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

function Divider() {
  return <View style={styles.divider} />;
}

function Section({ title, icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <View style={styles.section}>
      <TouchableOpacity
        onPress={() => setOpen((v) => !v)}
        activeOpacity={0.9}
        style={styles.sectionHeader}
      >
        <View style={styles.sectionHeaderLeft}>
          <View style={styles.sectionIcon}>
            {icon || <Ionicons name="information-circle" size={18} color="#EDEBFF" />}
          </View>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>

        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={18}
          color="rgba(245,245,255,0.85)"
        />
      </TouchableOpacity>

      {open ? <View style={styles.sectionBody}>{children}</View> : null}
    </View>
  );
}

function Bullet({ children }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

function Emph({ children }) {
  return <Text style={styles.bold}>{children}</Text>;
}

function TipBox({ title, text, tone = "info", icon }) {
  const map = {
    info: { bg: "rgba(59,130,246,0.14)", bd: "rgba(59,130,246,0.28)", tx: "rgba(220,235,255,0.92)" },
    warn: { bg: "rgba(245,158,11,0.14)", bd: "rgba(245,158,11,0.28)", tx: "rgba(255,233,199,0.92)" },
    ok: { bg: "rgba(34,197,94,0.12)", bd: "rgba(34,197,94,0.24)", tx: "rgba(215,255,234,0.92)" },
  };
  const t = map[tone] || map.info;

  return (
    <View style={[styles.tipBox, { backgroundColor: t.bg, borderColor: t.bd }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View style={styles.tipIcon}>
          {icon || <Ionicons name="information-circle" size={18} color={t.tx} />}
        </View>
        <Text style={[styles.tipTitle, { color: t.tx }]}>{title}</Text>
      </View>
      <Text style={[styles.tipText, { color: t.tx }]}>{text}</Text>
    </View>
  );
}

export default function HelpModesScreen({ navigation }) {
  return (
    <View style={styles.root}>
      <LinearGradient colors={["#070712", "#0B0B16", "#050509"]} style={styles.bg} />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* HERO */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Guía de INSQUIZ</Text>
          <Text style={styles.heroSubtitle}>
            Aquí se explica cómo funcionan los modos, qué hace cada cosa en la interfaz
            y qué hacer cuando algo no sale como esperabas.
          </Text>

          <View style={styles.heroActions}>
            <TouchableOpacity style={styles.btn} onPress={() => navigation?.goBack?.()} activeOpacity={0.9}>
              <Ionicons name="arrow-back" size={18} color="#F5F5FF" />
              <Text style={styles.btnText}>Volver</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnSoft} onPress={() => navigation?.navigate?.("Home")} activeOpacity={0.9}>
              <Ionicons name="home" size={18} color="#F5F5FF" />
              <Text style={styles.btnText}>Ir al inicio</Text>
            </TouchableOpacity>
          </View>

          <Divider />

          <TipBox
            tone="ok"
            icon={<Ionicons name="checkmark-circle" size={18} color="rgba(215,255,234,0.92)" />}
            title="Idea central"
            text={
              "INSQUIZ no solo es “responder”.\n\n" +
              "Lo importante es: practicar, revisar, entender por qué, y repetir con intención."
            }
          />
        </View>

        {/* MODOS */}
        <Section
          title="1) Modos principales (qué son y para qué sirven)"
          defaultOpen={true}
          icon={<MaterialCommunityIcons name="layers-outline" size={18} color="#EDEBFF" />}
        >
          <Text style={styles.paragraph}>
            INSQUIZ puede tener varios modos. Aunque el nombre cambie según la versión, la idea suele ser esta:
          </Text>

          <Bullet>
            <Emph>Práctica:</Emph> respondes preguntas para entrenar. Ideal para constancia diaria.
          </Bullet>
          <Bullet>
            <Emph>Práctica adaptativa:</Emph> el sistema se enfoca más en lo que te cuesta (para que mejores más rápido).
          </Bullet>
          <Bullet>
            <Emph>Revisión (Review):</Emph> vuelves a preguntas ya vistas para consolidar aprendizaje.
          </Bullet>
          <Bullet>
            <Emph>Simulacro / RealSim:</Emph> una experiencia más parecida a un examen real, a veces por sesiones.
          </Bullet>

          <TipBox
            tone="info"
            title="Cómo elegir el modo correcto"
            text={
              "• Si estás empezando: Práctica.\n" +
              "• Si ya llevas días y detectaste fallas: Adaptativa.\n" +
              "• Si quieres memorizar el aprendizaje: Revisión.\n" +
              "• Si quieres medir tu nivel real: Simulacro."
            }
          />
        </Section>

        <Section
          title="2) Qué esperar en un simulacro (RealSim)"
          icon={<MaterialCommunityIcons name="timer-sand" size={18} color="#EDEBFF" />}
        >
          <Text style={styles.paragraph}>
            Un simulacro suele intentar imitar condiciones reales: más preguntas, más concentración, a veces tiempo,
            y a veces sesiones.
          </Text>

          <Bullet>
            Puedes ver instrucciones antes de empezar (para que sepas qué viene).
          </Bullet>
          <Bullet>
            Es normal que sea más exigente que la práctica diaria.
          </Bullet>
          <Bullet>
            Al final, se muestra un resultado o resumen (dependiendo de la versión).
          </Bullet>

          <TipBox
            tone="warn"
            title="Cosas que pueden pasar en simulacros"
            text={
              "• Si se cierra la app, a veces el sistema intenta reanudar.\n" +
              "• Si la conexión falla, puede pausar ciertas funciones.\n" +
              "• Si estás en una sesión, puede que no te deje saltar como en práctica.\n\n" +
              "Eso no es castigo: es para mantener el simulacro coherente."
            }
          />
        </Section>

        <Section
          title="3) Qué hace cada parte de la interfaz (sin lenguaje raro)"
          icon={<Ionicons name="grid-outline" size={18} color="#EDEBFF" />}
        >
          <Text style={styles.paragraph}>
            Esta sección describe comportamientos típicos:
          </Text>

          <Bullet>
            <Emph>Botón “Volver”:</Emph> regresa a la pantalla anterior.
          </Bullet>
          <Bullet>
            <Emph>Botón “Inicio”:</Emph> te lleva al menú principal.
          </Bullet>
          <Bullet>
            <Emph>Resultados:</Emph> muestra qué acertaste y qué fallaste (y a veces una explicación).
          </Bullet>
          <Bullet>
            <Emph>Revisión:</Emph> te permite retomar preguntas para aprender “en serio”.
          </Bullet>
          <Bullet>
            <Emph>Configuración:</Emph> cosas como revisar actualizaciones, ver tu licencia, y herramientas de soporte.
          </Bullet>

          <TipBox
            tone="ok"
            title="Regla de oro"
            text={
              "Si una pantalla te pide algo y no entiendes por qué, no adivines.\n" +
              "Vuelve, revisa la guía, o reporta el caso.\n\n" +
              "INSQUIZ está diseñado para ser exigente en aprendizaje, no confuso en uso."
            }
          />
        </Section>

        <Section
          title="4) Qué cosas pueden no funcionar a veces (y por qué)"
          icon={<Ionicons name="alert-circle-outline" size={18} color="#EDEBFF" />}
        >
          <Text style={styles.paragraph}>
            A veces una función puede no estar disponible. Las causas más comunes:
          </Text>

          <Bullet>
            <Emph>Conexión débil:</Emph> si el internet está inestable, ciertas cosas pueden tardar o fallar.
          </Bullet>
          <Bullet>
            <Emph>Actualización:</Emph> algunas mejoras requieren estar en una versión nueva.
          </Bullet>
          <Bullet>
            <Emph>Protección del progreso:</Emph> si el sistema detecta riesgo de pérdida, puede bloquear algo temporalmente.
          </Bullet>
          <Bullet>
            <Emph>Mantenimiento:</Emph> se desactiva una parte para mejorarla.
          </Bullet>

          <TipBox
            tone="warn"
            title="Qué hacer si algo no funciona"
            text={
              "1) Cierra y abre la aplicación.\n" +
              "2) Prueba otra conexión (WiFi ↔ datos).\n" +
              "3) Revisa “Buscar actualizaciones”.\n" +
              "4) Si persiste, reporta con pasos claros.\n\n" +
              "Evita borrar datos sin necesidad: eso puede borrar progreso guardado localmente."
            }
          />
        </Section>

        <Section
          title="5) Errores comunes y soluciones rápidas"
          icon={<Ionicons name="medical-outline" size={18} color="#EDEBFF" />}
        >
          <Bullet>
            <Emph>“No carga” o “se queda pensando”:</Emph> cambia de internet y vuelve a entrar.
          </Bullet>
          <Bullet>
            <Emph>“Me devuelve al inicio”:</Emph> a veces el sistema protege una acción si algo no está listo.
          </Bullet>
          <Bullet>
            <Emph>No veo explicación al responder:</Emph> puede ser un dato faltante o una actualización pendiente.
          </Bullet>
          <Bullet>
            <Emph>Sección deshabilitada:</Emph> es normal si está en mejora; vuelve más tarde.
          </Bullet>

          <TipBox
            tone="info"
            title="Cómo reportar bien"
            text={
              "Un buen reporte tiene:\n" +
              "• Qué estabas haciendo\n" +
              "• Dónde estabas\n" +
              "• Qué tocaste\n" +
              "• Qué esperabas que pasara\n" +
              "• Qué pasó realmente\n\n" +
              "Eso permite arreglar problemas rápido."
            }
          />
        </Section>

        {/* Sección técnica opcional */}
        <Section
          title="Sección técnica (opcional)"
          icon={<Ionicons name="terminal-outline" size={18} color="#EDEBFF" />}
        >
          <Text style={styles.paragraph}>
            Esta sección es para soporte / pruebas. Si no te interesa, ignórala.
          </Text>

          <Bullet>
            Algunas pantallas dependen de estado interno (por ejemplo validaciones de acceso o sincronización).
          </Bullet>
          <Bullet>
            La pantalla de diagnóstico puede mostrar mensajes internos para ayudar a soporte.
          </Bullet>
          <Bullet>
            Si soporte te pide “mensajes internos”, puedes abrir el modo diagnóstico desde Configuración.
          </Bullet>
        </Section>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#050509" },
  bg: { ...StyleSheet.absoluteFillObject },

  scroll: { padding: 16, paddingTop: 18, paddingBottom: 26 },

  hero: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderRadius: 26,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 18 },
    elevation: 10,
  },
  heroTitle: { color: "#F5F5FF", fontSize: 22, fontWeight: "900", textAlign: "center" },
  heroSubtitle: {
    marginTop: 8,
    color: "rgba(245,245,255,0.78)",
    fontSize: 13.5,
    lineHeight: 18.5,
    textAlign: "center",
    fontWeight: "700",
  },

  heroActions: { marginTop: 14, flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "center" },
  btn: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderColor: "rgba(255,255,255,0.22)",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  btnSoft: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  btnText: { color: "#F5F5FF", fontSize: 14, fontWeight: "900" },

  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.10)", marginVertical: 16 },

  paragraph: { color: "rgba(245,245,255,0.78)", fontSize: 13.5, lineHeight: 18.5, marginTop: 8 },
  bold: { color: "#F5F5FF", fontWeight: "900" },

  section: {
    marginTop: 12,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    overflow: "hidden",
  },
  sectionHeader: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 10, flexShrink: 1 },
  sectionIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: { color: "#F5F5FF", fontSize: 14.2, fontWeight: "900", flexShrink: 1 },
  sectionBody: { paddingHorizontal: 14, paddingBottom: 14, paddingTop: 2 },

  bulletRow: { flexDirection: "row", marginTop: 8 },
  bulletDot: { width: 16, color: "#F5F5FF", fontSize: 14, marginTop: 1, fontWeight: "900" },
  bulletText: { flex: 1, color: "rgba(245,245,255,0.78)", fontSize: 13.5, lineHeight: 18.5 },

  tipBox: { borderWidth: 1, borderRadius: 18, padding: 14, marginTop: 14 },
  tipIcon: { width: 26, height: 26, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  tipTitle: { fontSize: 13.5, fontWeight: "900" },
  tipText: { marginTop: 10, fontSize: 13, lineHeight: 17.5, fontWeight: "700" },
});
