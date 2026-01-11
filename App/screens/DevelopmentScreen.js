// App/screens/DevelopmentScreen.js
// =====================================================
// INSQUIZ — Pantalla de Desarrollo / Mantenimiento (ULTRA EXPLICATIVA)
// - Lenguaje humano (usuario-first)
// - Guía completa: qué significa, qué puede estar pasando, qué hacer, qué NO hacer
// - Sección técnica opcional (colapsable)
// =====================================================

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

function Divider() {
  return <View style={styles.divider} />;
}

function Pill({ icon, text, tone = "neutral" }) {
  const tones = {
    neutral: { bg: "rgba(255,255,255,0.08)", bd: "rgba(255,255,255,0.14)", tx: "#EDEBFF" },
    info: { bg: "rgba(59,130,246,0.16)", bd: "rgba(59,130,246,0.28)", tx: "#DCEBFF" },
    warn: { bg: "rgba(245,158,11,0.16)", bd: "rgba(245,158,11,0.28)", tx: "#FFE9C7" },
    ok: { bg: "rgba(34,197,94,0.14)", bd: "rgba(34,197,94,0.26)", tx: "#D7FFEA" },
    danger: { bg: "rgba(239,68,68,0.14)", bd: "rgba(239,68,68,0.26)", tx: "#FFD7D7" },
  };

  const t = tones[tone] || tones.neutral;

  return (
    <View style={[styles.pill, { backgroundColor: t.bg, borderColor: t.bd }]}>
      {icon ? <View style={{ marginRight: 8 }}>{icon}</View> : null}
      <Text style={[styles.pillText, { color: t.tx }]}>{text}</Text>
    </View>
  );
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

function NoteBox({ icon, title, text, tone = "info" }) {
  const map = {
    info: { bg: "rgba(59,130,246,0.14)", bd: "rgba(59,130,246,0.28)", tx: "rgba(220,235,255,0.92)" },
    warn: { bg: "rgba(245,158,11,0.14)", bd: "rgba(245,158,11,0.28)", tx: "rgba(255,233,199,0.92)" },
    ok: { bg: "rgba(34,197,94,0.12)", bd: "rgba(34,197,94,0.24)", tx: "rgba(215,255,234,0.92)" },
    danger: { bg: "rgba(239,68,68,0.12)", bd: "rgba(239,68,68,0.24)", tx: "rgba(255,215,215,0.92)" },
  };
  const t = map[tone] || map.info;

  return (
    <View style={[styles.noteBox, { backgroundColor: t.bg, borderColor: t.bd }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View style={styles.noteIcon}>
          {icon || <Ionicons name="information-circle" size={18} color={t.tx} />}
        </View>
        <Text style={[styles.noteTitle, { color: t.tx }]}>{title}</Text>
      </View>
      <Text style={[styles.noteText, { color: t.tx }]}>{text}</Text>
    </View>
  );
}

export default function DevelopmentScreen({ navigation, route }) {
  // Puedes pasar un motivo desde otras pantallas:
  // navigation.navigate("DevelopmentScreen", { reason: "RealSim", details: "..." })
  const reason = route?.params?.reason || null;
  const details = route?.params?.details || null;

  const subtitle = useMemo(() => {
    if (!reason) return "Esta sección está en construcción o temporalmente en mantenimiento.";
    return `Esta sección está temporalmente deshabilitada: ${reason}.`;
  }, [reason]);

  const onGoHome = () => navigation?.navigate?.("Home");
  const onGoBack = () => navigation?.goBack?.();

  const onHowToReport = () => {
    Alert.alert(
      "Cómo reportar un problema",
      "Si esta pantalla aparece cuando no debería, puedes reportarlo.\n\n" +
        "Incluye esta información:\n" +
        "1) Qué estabas intentando hacer\n" +
        "2) En qué pantalla estabas\n" +
        "3) Si estabas con WiFi o datos\n" +
        "4) Si esto pasa siempre o a veces\n\n" +
        "Si tienes el modo diagnóstico, también sirve una captura de esa pantalla."
    );
  };

  return (
    <View style={styles.root}>
      <LinearGradient colors={["#070712", "#0B0B16", "#050509"]} style={styles.bg} />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* HERO */}
        <View style={styles.card}>
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons name="wrench-cog" size={46} color="#F5F5FF" />
          </View>

          <Text style={styles.title}>Esta sección no está disponible ahora</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          {(details || reason) ? (
            <View style={{ marginTop: 14, width: "100%" }}>
              <View style={styles.softLine} />
              <Text style={styles.smallLabel}>Información adicional</Text>
              <Text style={styles.smallValue}>
                {details
                  ? details
                  : "Esta pantalla puede aparecer cuando una función se está mejorando o revisando."}
              </Text>
            </View>
          ) : null}

          <View style={styles.pillRow}>
            <Pill
              tone="warn"
              icon={<Ionicons name="hammer-outline" size={14} color="#FFE9C7" />}
              text="En desarrollo / mantenimiento"
            />
            <Pill
              tone="info"
              icon={<Ionicons name="shield-checkmark-outline" size={14} color="#DCEBFF" />}
              text="Protección de tu progreso"
            />
            <Pill
              tone="neutral"
              icon={<Ionicons name="time-outline" size={14} color="#EDEBFF" />}
              text="Vuelve más tarde"
            />
          </View>

          <Divider />

          <Text style={styles.paragraph}>
            Esta pantalla existe a propósito. En INSQUIZ preferimos mostrarte esto antes que dejarte entrar a una
            función a medio construir y que termine en errores raros, pérdida de progreso o comportamientos confusos.
          </Text>

          <View style={{ height: 14 }} />

          <NoteBox
            tone="ok"
            icon={<Ionicons name="checkmark-circle" size={18} color="rgba(215,255,234,0.92)" />}
            title="Lo más importante"
            text={
              "No hiciste nada mal.\n\n" +
              "Esto normalmente significa que la función se está preparando, actualizando, o se desactivó temporalmente para evitar problemas."
            }
          />

          <View style={{ height: 10 }} />

          <NoteBox
            tone="info"
            icon={<Ionicons name="information-circle" size={18} color="rgba(220,235,255,0.92)" />}
            title="Qué puede estar pasando"
            text={
              "1) La función está en construcción.\n" +
              "2) Se está mejorando para que sea más estable.\n" +
              "3) Se detectó un problema y se desactivó para proteger datos.\n" +
              "4) Hay cambios internos y se está verificando que todo funcione bien."
            }
          />

          <View style={{ height: 10 }} />

          <NoteBox
            tone="warn"
            icon={<Ionicons name="alert-circle" size={18} color="rgba(255,233,199,0.92)" />}
            title="Qué puedes intentar (sin complicarte)"
            text={
              "• Cierra y abre la aplicación.\n" +
              "• Cambia de internet (WiFi ↔ datos) si estabas con mala señal.\n" +
              "• Intenta más tarde.\n\n" +
              "Si esto aparece repetidamente en una sección que antes funcionaba, repórtalo."
            }
          />

          <View style={{ height: 10 }} />

          <NoteBox
            tone="danger"
            icon={<Ionicons name="close-circle" size={18} color="rgba(255,215,215,0.92)" />}
            title="Qué NO recomendamos hacer"
            text={
              "• No borres datos de la app solo por esto.\n" +
              "• No reinstales sin necesidad.\n" +
              "• No intentes “forzar” la función tocando repetidas veces.\n\n" +
              "Si borras datos, es posible que pierdas progreso guardado en el dispositivo."
            }
          />

          <View style={{ height: 18 }} />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.primaryBtn} onPress={onGoBack} activeOpacity={0.9}>
              <Ionicons name="arrow-back" size={18} color="#F5F5FF" />
              <Text style={styles.primaryText}>Volver</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn} onPress={onGoHome} activeOpacity={0.9}>
              <Ionicons name="home" size={18} color="#F5F5FF" />
              <Text style={styles.secondaryText}>Ir al inicio</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.ghostBtn} onPress={onHowToReport} activeOpacity={0.9}>
              <Ionicons name="help-circle-outline" size={18} color="#F5F5FF" />
              <Text style={styles.ghostText}>Cómo reportar</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerNote}>INSQUIZ · Estado temporal</Text>
        </View>

        {/* SECCIONES EXPLICATIVAS (ULTRA) */}
        <Section
          title="¿Qué significa exactamente “en desarrollo”?"
          defaultOpen={true}
          icon={<MaterialCommunityIcons name="progress-wrench" size={18} color="#EDEBFF" />}
        >
          <Text style={styles.paragraph}>
            Significa que esa parte de la app aún está siendo trabajada, probada o mejorada. A veces la interfaz ya existe,
            pero el “motor” interno todavía no está listo o está siendo ajustado para que sea estable.
          </Text>

          <Bullet>
            Ejemplo: un botón puede existir, pero la función detrás aún está en revisión.
          </Bullet>
          <Bullet>
            Ejemplo: la función existe, pero se desactivó temporalmente porque se detectó un problema.
          </Bullet>

          <Text style={styles.paragraph}>
            En pocas palabras: <Emph>preferimos decirte “aún no”</Emph> antes que dejarte entrar a una zona que podría dar
            resultados incorrectos.
          </Text>
        </Section>

        <Section
          title="¿Qué significa “mantenimiento”?"
          icon={<Ionicons name="settings-outline" size={18} color="#EDEBFF" />}
        >
          <Text style={styles.paragraph}>
            “Mantenimiento” significa que una función ya existe, pero está siendo revisada o ajustada. Puede ser por:
          </Text>
          <Bullet>Mejoras de estabilidad.</Bullet>
          <Bullet>Ajustes para evitar errores.</Bullet>
          <Bullet>Mejoras de rendimiento.</Bullet>
          <Bullet>Corrección de comportamientos que no se veían a simple vista.</Bullet>

          <Text style={styles.paragraph}>
            Muchas veces esto dura poco. La idea es que cuando vuelvas, todo funcione mejor que antes.
          </Text>
        </Section>

        <Section
          title="¿Por qué INSQUIZ bloquea ciertas cosas en vez de “dejar que pase”?"
          icon={<Ionicons name="shield-outline" size={18} color="#EDEBFF" />}
        >
          <Text style={styles.paragraph}>
            Porque en una app de estudio, <Emph>la confianza</Emph> es parte del producto.
            Si el sistema te deja hacer algo “a medias”, puedes:
          </Text>
          <Bullet>Perder progreso o que se guarde mal.</Bullet>
          <Bullet>Recibir resultados incorrectos.</Bullet>
          <Bullet>Creer que mejoraste cuando en realidad fue un fallo del sistema.</Bullet>

          <Text style={styles.paragraph}>
            En INSQUIZ preferimos: <Emph>bloqueo claro + explicación</Emph>.
          </Text>
        </Section>

        <Section
          title="Si esta pantalla aparece demasiado: qué revisar"
          icon={<Ionicons name="search-outline" size={18} color="#EDEBFF" />}
        >
          <Text style={styles.paragraph}>
            Si esto aparece muchas veces seguidas, revisa estas posibilidades:
          </Text>
          <Bullet>
            <Emph>Conexión:</Emph> si tu internet está inestable, algunas funciones pueden quedar deshabilitadas temporalmente.
          </Bullet>
          <Bullet>
            <Emph>Actualización:</Emph> puede que haya una versión nueva con cambios. Revisa “Buscar actualizaciones”.
          </Bullet>
          <Bullet>
            <Emph>Estado de licencia:</Emph> algunas funciones pueden depender de la licencia activa.
          </Bullet>

          <Text style={styles.paragraph}>
            Si todo eso está bien y esto sigue: <Emph>repórtalo</Emph> con la información del botón “Cómo reportar”.
          </Text>
        </Section>

        {/* Sección técnica opcional */}
        <Section
          title="Sección técnica (opcional)"
          icon={<Ionicons name="terminal-outline" size={18} color="#EDEBFF" />}
        >
          <Text style={styles.paragraph}>
            Esto es solo para soporte o pruebas. Si no entiendes algo, puedes ignorarlo.
          </Text>

          <Bullet>
            Algunas funciones pueden depender de verificación de estado (licencia / conexión / sincronización).
          </Bullet>
          <Bullet>
            Si tienes “Modo diagnóstico”, puedes capturar un pantallazo de los mensajes internos.
          </Bullet>
          <Bullet>
            Si el equipo de soporte te pide un “registro de mensajes”, esa pantalla sirve.
          </Bullet>

          <NoteBox
            tone="info"
            title="Qué información ayuda a soporte"
            text={
              "• Pantalla donde ocurrió\n" +
              "• Paso a paso de cómo llegaste aquí\n" +
              "• Si estabas con WiFi o datos\n" +
              "• Si sucede siempre o solo a veces\n" +
              "• Captura del modo diagnóstico (si aplica)"
            }
          />
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

  card: {
    width: "100%",
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

  iconWrapper: {
    width: 84,
    height: 84,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    alignSelf: "center",
  },

  title: {
    color: "#F5F5FF",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    color: "rgba(245,245,255,0.78)",
    fontSize: 13.5,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 6,
  },

  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
    justifyContent: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  pillText: { fontSize: 12.5, fontWeight: "800" },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.10)",
    marginVertical: 16,
  },

  paragraph: {
    color: "rgba(245,245,255,0.78)",
    fontSize: 13.5,
    lineHeight: 18.5,
    marginTop: 8,
  },
  bold: { color: "#F5F5FF", fontWeight: "900" },

  softLine: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.10)",
    marginTop: 6,
    marginBottom: 10,
  },
  smallLabel: {
    color: "rgba(245,245,255,0.65)",
    fontSize: 12,
    fontWeight: "800",
  },
  smallValue: {
    marginTop: 6,
    color: "rgba(245,245,255,0.78)",
    fontSize: 12.8,
    lineHeight: 17.5,
  },

  actions: { width: "100%", marginTop: 16, gap: 12 },
  primaryBtn: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderColor: "rgba(255,255,255,0.22)",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 18,
  },
  primaryText: { color: "#F5F5FF", fontSize: 14, fontWeight: "900" },

  secondaryBtn: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 18,
  },
  secondaryText: { color: "#F5F5FF", fontSize: 13.5, fontWeight: "800" },

  ghostBtn: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(59,130,246,0.12)",
    borderColor: "rgba(59,130,246,0.24)",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 18,
  },
  ghostText: { color: "#F5F5FF", fontSize: 13.5, fontWeight: "800" },

  footerNote: {
    marginTop: 14,
    color: "rgba(245,245,255,0.55)",
    fontSize: 11.5,
    fontWeight: "800",
    textAlign: "center",
  },

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
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
  },
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
  sectionTitle: {
    color: "#F5F5FF",
    fontSize: 14.2,
    fontWeight: "900",
    flexShrink: 1,
  },
  sectionBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 2,
  },

  bulletRow: { flexDirection: "row", marginTop: 8 },
  bulletDot: {
    width: 16,
    color: "#F5F5FF",
    fontSize: 14,
    marginTop: 1,
    fontWeight: "900",
  },
  bulletText: {
    flex: 1,
    color: "rgba(245,245,255,0.78)",
    fontSize: 13.5,
    lineHeight: 18.5,
  },

  noteBox: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
  },
  noteIcon: {
    width: 26,
    height: 26,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  noteTitle: { fontSize: 13.5, fontWeight: "900" },
  noteText: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 17.5,
    fontWeight: "700",
  },
});
