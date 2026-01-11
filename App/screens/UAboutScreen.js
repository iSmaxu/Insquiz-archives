// App/screens/AboutScreen.js
// =====================================================
// INSQUIZ — AboutScreen (manual extremo / ultra explicativo)
// - Diseñado para explicar TODO: cómo funciona, qué hacer si falla,
//   qué significan los mensajes, cómo diagnosticar, etc.
// - No prioriza comodidad: prioriza exhaustividad.
// =====================================================

import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// Si tú ya tienes un wrapper con padding + scroll bonito, úsalo:
// import ScrollWrapper from "../components/ScrollWrapper";

// =====================================================
// Helpers UI
// =====================================================

function Pill({ icon, text, tone = "neutral" }) {
  const toneStyles = {
    neutral: { bg: "rgba(255,255,255,0.08)", bd: "rgba(255,255,255,0.14)", tx: "#EDEBFF" },
    info: { bg: "rgba(59,130,246,0.16)", bd: "rgba(59,130,246,0.28)", tx: "#DCEBFF" },
    warn: { bg: "rgba(245,158,11,0.16)", bd: "rgba(245,158,11,0.28)", tx: "#FFE9C7" },
    danger: { bg: "rgba(239,68,68,0.14)", bd: "rgba(239,68,68,0.26)", tx: "#FFD7D7" },
    ok: { bg: "rgba(34,197,94,0.14)", bd: "rgba(34,197,94,0.26)", tx: "#D7FFEA" },
  };

  const t = toneStyles[tone] || toneStyles.neutral;

  return (
    <View style={[styles.pill, { backgroundColor: t.bg, borderColor: t.bd }]}>
      {icon ? <View style={{ marginRight: 8 }}>{icon}</View> : null}
      <Text style={[styles.pillText, { color: t.tx }]}>{text}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function Section({ title, icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <View style={styles.section}>
      <TouchableOpacity
        onPress={() => setOpen((v) => !v)}
        activeOpacity={0.85}
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

function CodeBlock({ children }) {
  return (
    <View style={styles.codeBlock}>
      <Text style={styles.codeText}>{children}</Text>
    </View>
  );
}

function SmallTitle({ children }) {
  return <Text style={styles.smallTitle}>{children}</Text>;
}

// =====================================================
// Main
// =====================================================

export default function AboutScreen({ navigation }) {
  const buildInfo = useMemo(() => {
    // Si tú manejas un constants.js con versión, build number, etc.,
    // reemplaza esto por tus valores reales.
    return {
      appName: "INSQUIZ",
      flavor: "Mobile App",
      platform: Platform.OS,
      // version: Constants.expoConfig?.version ?? "—",
      // build: Constants.expoConfig?.ios?.buildNumber ?? Constants.expoConfig?.android?.versionCode ?? "—",
    };
  }, []);

  const onOpenSupport = () => {
    Alert.alert(
      "Soporte / Diagnóstico",
      "Esta pantalla no tiene la capacidad de abrir enlaces directamente.\n\nPor favor, visita nuestro canal de soporte a través de WhatsApp para obtener ayuda:\n\nComunicate al whatsapp: 3217534005"
    );
  };

  const onSafetyNote = () => {
    Alert.alert(
      "Nota de seguridad",
      "Nunca compartas públicamente:\n- Tu clave/licencia\n- Tu deviceId\n- Capturas de pantalla con información sensible\n\n Solo comparte estos datos al momento de comunicarte con soporte para facilar la ayuda."
    );
  };

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#070712", "#0B0B16", "#050509"]}
        style={styles.bg}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Acerca de INSQUIZ</Text>
          <Text style={styles.heroSubtitle}>
            Este es el “manual extremo”: no está hecho para ser corto. Está hecho para
            que entiendas cómo funciona el sistema, qué esperar, y qué hacer cuando algo falla.
          </Text>

          <View style={styles.pillRow}>
            <Pill
              tone="info"
              icon={<Ionicons name="rocket" size={14} color="#DCEBFF" />}
              text={`${buildInfo.appName} · ${buildInfo.flavor}`}
            />
            <Pill
              tone="neutral"
              icon={<Ionicons name="phone-portrait" size={14} color="#EDEBFF" />}
              text={`Plataforma: ${buildInfo.platform}`}
            />
            <Pill
              tone="warn"
              icon={<Ionicons name="construct" size={14} color="#FFE9C7" />}
              text={`Modo: app educativa con control de licencia`}
            />
          </View>

          <View style={styles.heroActions}>
            <TouchableOpacity style={styles.actionBtn} onPress={onOpenSupport} activeOpacity={0.9}>
              <Ionicons name="help-circle" size={18} color="#F5F5FF" />
              <Text style={styles.actionText}>Cómo reportar errores</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtnGhost} onPress={onSafetyNote} activeOpacity={0.9}>
              <Ionicons name="shield-checkmark" size={18} color="#F5F5FF" />
              <Text style={styles.actionText}>Seguridad de datos</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Divider />

        {/* 1) Qué es INSQUIZ */}
        <Section
          title="1) Qué es INSQUIZ y qué NO es"
          defaultOpen={true}
          icon={<Ionicons name="sparkles" size={18} color="#EDEBFF" />}
        >
          <Text style={styles.paragraph}>
            INSQUIZ es una aplicación de entrenamiento académico diseñada para práctica intensa,
            simulacros y progreso medible. En el centro hay una idea simple:{" "}
            <Text style={styles.bold}>no se trata solo de responder preguntas</Text>,
            se trata de aprender de forma sistemática (con retroalimentación, justificación y repetición inteligente).
          </Text>

          <SmallTitle>Lo que hace</SmallTitle>
          <Bullet>Permite practicar por modos (por ejemplo: práctica, simulacro, examen real/sesiones).</Bullet>
          <Bullet>Guarda progreso (según tu implementación: local, remoto o híbrido).</Bullet>
          <Bullet>Controla acceso mediante licencias y registro de dispositivos.</Bullet>
          <Bullet>Incluye “motores” internos: navegación, control de estado, guardado y validaciones.</Bullet>
            <Bullet>Proporciona justificaciones pedagógicas para cada pregunta.</Bullet>

        </Section>

        {/* 2) Arquitectura mental del sistema */}
        <Section
          title="2) Cómo pensar la app por dentro"
          icon={<MaterialCommunityIcons name="sitemap" size={18} color="#EDEBFF" />}
        >
          <Text style={styles.paragraph}>
            Para entender INSQUIZ sin ver código, imagina capas:
          </Text>

          <Bullet>
            <Text style={styles.bold}>Capa UI (pantallas):</Text> HomeScreen, menús, QuizScreen, resultados, ajustes.
          </Bullet>
          <Bullet>
            <Text style={styles.bold}>Capa de navegación:</Text> decide qué pantalla se muestra y cuándo.
          </Bullet>
          <Bullet>
            <Text style={styles.bold}>Capa de servicios:</Text> DeviceIdService, LicenseService, OfflineContext,
            guardado de progreso, etc.
          </Bullet>
          <Bullet>
            <Text style={styles.bold}>Capa de datos:</Text> almacenamiento local (AsyncStorage) y/o Firebase (Realtime DB / Firestore).
          </Bullet>
          <Bullet>
            <Text style={styles.bold}>Capa de políticas:</Text> reglas que determinan si algo se permite (por ejemplo ERelease).
          </Bullet>

          <Text style={styles.paragraph}>
            Cuando “algo no funciona”, casi siempre la causa real vive en una de estas capas.
            La clave es diagnosticar: ¿UI? ¿Navegación? ¿Licencia? ¿Datos? ¿Conectividad?
          </Text>
        </Section>

        {/* 3) Licencias */}
        <Section
          title="3) Licencias: qué son, por qué existen y cómo se validan"
          icon={<Ionicons name="key" size={18} color="#EDEBFF" />}
        >
          <Text style={styles.paragraph}>
            INSQUIZ utiliza un sistema de licencia para controlar acceso. Una licencia normalmente incluye:
          </Text>

          <Bullet><Text style={styles.bold}>Estado:</Text> activa/inactiva.</Bullet>
          <Bullet><Text style={styles.bold}>Expiración:</Text> una fecha/hora límite (expiresAt).</Bullet>
          <Bullet><Text style={styles.bold}>Límite de dispositivos:</Text> maxDevices.</Bullet>
          <Bullet><Text style={styles.bold}>Registro de dispositivos:</Text> lista de deviceIds con firstSeen / lastSeen.</Bullet>

          <Text style={styles.paragraph}>
            ¿Por qué tanto control? Porque evita que una licencia se copie sin control,
            y también permite soporte: saber si el usuario está usando el sistema en el dispositivo esperado.
          </Text>

          <SmallTitle>Qué pasa cuando falla la licencia</SmallTitle>
          <Bullet>Si la licencia está inactiva: la app debe bloquearse o limitar funciones.</Bullet>
          <Bullet>Si la licencia expiró: la app debe pedir renovación o deshabilitar el acceso.</Bullet>
          <Bullet>Si excede maxDevices: debe negar el registro de un nuevo dispositivo.</Bullet>

          <SmallTitle>Qué debes hacer si ves problemas de licencia</SmallTitle>
          <Bullet>Verifica que escribiste la licencia exactamente (si tu app requiere tipeo manual).</Bullet>
          <Bullet>Verifica conexión a internet (la validación inicial suele requerir red).</Bullet>
          <Bullet>Reinicia la app completamente (cerrar y abrir, no solo minimizar).</Bullet>
          <Bullet>Si cambiaste de celular: pide al administrador liberar un cupo o resetear dispositivos.</Bullet>
        </Section>

        {/* 4) deviceId */}
        <Section
          title="4) DeviceId: qué es y por qué se usa"
          icon={<MaterialCommunityIcons name="fingerprint" size={18} color="#EDEBFF" />}
        >
          <Text style={styles.paragraph}>
            El <Text style={styles.bold}>deviceId</Text> es un identificador que INSQUIZ usa para reconocer un dispositivo.
            No es “tu nombre”, no es “tu cuenta bancaria”, no es “tu vida”. Es un identificador técnico para:
          </Text>

          <Bullet>Registrar dispositivos permitidos dentro de una licencia.</Bullet>
          <Bullet>Actualizar “lastSeen” y detectar actividad.</Bullet>
          <Bullet>Evitar que una licencia se use en demasiados dispositivos.</Bullet>

          <SmallTitle>Qué hacer si el deviceId parece cambiar</SmallTitle>
          <Bullet>
            Si reinstalas la app o borras almacenamiento, algunos métodos pueden regenerar IDs. Eso puede “contar como dispositivo nuevo”.
          </Bullet>
          <Bullet>
            Si cambias de teléfono, es normal que el deviceId sea distinto.
          </Bullet>
          <Bullet>
            Si estás en emulador, algunos IDs pueden ser raros o inestables.
          </Bullet>

        </Section>

        {/* 5) Offline */}
        <Section
          title="5) Modo offline: qué significa de verdad y por qué a veces bloquea"
          icon={<Ionicons name="cloud-offline" size={18} color="#EDEBFF" />}
        >
          <Text style={styles.paragraph}>
            “Offline” no es solo “sin internet”. En INSQUIZ suele significar:
            <Text style={styles.bold}> el sistema no puede confirmar estado en servidor</Text> (licencia, progreso,
            políticas, sincronización). Dependiendo de configuración, la app puede:
          </Text>

          <Bullet>Permitir uso temporal y revalidar después.</Bullet>
          <Bullet>Bloquear acceso si lleva demasiado tiempo sin confirmar.</Bullet>
          <Bullet>Activar un “offlineLockPending” y luego bloquear si no vuelve internet.</Bullet>

          <SmallTitle>Qué hacer si quedas bloqueado por offline</SmallTitle>
          <Bullet>Activa internet real (datos o WiFi funcional, no “conectado pero sin salida”).</Bullet>
          <Bullet>Abre y cierra la app. Espera a que revalide.</Bullet>
          <Bullet>Si tu red tiene firewall raro: prueba otra red (datos del celular).</Bullet>
          <Bullet>Si el servidor está caído: no es culpa tuya. Es un problema del backend.</Bullet>

          <SmallTitle>Errores comunes</SmallTitle>
          <Bullet>La app dice “sin conexión” aunque tengas WiFi: puede ser DNS o portal cautivo.</Bullet>
          
        </Section>

        {/* 6) ERelease */}
        <Section
          title="6) ERelease: mensajes dirigidos por licencia / política"
          icon={<MaterialCommunityIcons name="message-alert" size={18} color="#EDEBFF" />}
        >
          <Text style={styles.paragraph}>
            ERelease (en nuestro diseño) es un sistema de “release dirigido”: el admin puede publicar mensajes
            que solo ven ciertas licencias (por key/plan) y bajo reglas (status, prioridad, “mostrado una sola vez”, etc.).
          </Text>

          <SmallTitle>Qué debería hacer el sistema</SmallTitle>
          <Bullet>Buscar el ERelease más reciente aplicable.</Bullet>
          <Bullet>Verificar si ya fue mostrado en este dispositivo/usuario.</Bullet>
          <Bullet>Respetar reglas: licencia (Dev/dev/dEv…), estado activo, etc.</Bullet>


        </Section>

        {/* 7) Quiz / Justificaciones */}
        <Section
          title="7) Preguntas, opciones y justificación: qué debe ocurrir siempre"
          icon={<Ionicons name="school" size={18} color="#EDEBFF" />}
        >
          <Text style={styles.paragraph}>
            Una pregunta típica de INSQUIZ debería tener:
          </Text>

          <Bullet><Text style={styles.bold}>Enunciado/contexto</Text> (texto, diálogo o situación).</Bullet>
          <Bullet><Text style={styles.bold}>Pregunta</Text> (qué se pide).</Bullet>
          <Bullet><Text style={styles.bold}>4 opciones A–D</Text> (si tu estándar exige exactamente 4).</Bullet>
          <Bullet><Text style={styles.bold}>Respuesta correcta</Text> (A/B/C/D).</Bullet>
          <Bullet><Text style={styles.bold}>Justificación</Text> (explicación pedagógica completa).</Bullet>

          <SmallTitle>Si no aparece la justificación al responder</SmallTitle>
          <Bullet>Puede que la pantalla de resultados no esté recibiendo “justification”.</Bullet>
          <Bullet>Puede que el campo venga nulo desde el banco (dato incompleto).</Bullet>
          <Bullet>Puede que tu UI esté escondiéndola por estilos/scroll.</Bullet>
          <Bullet>Puede que el estado se resetee al navegar (unmount/mount).</Bullet>

          <SmallTitle>Qué hacer como usuario</SmallTitle>
          <Bullet>Reintenta otra pregunta. Si falla siempre, es bug del sistema, no tuyo.</Bullet>
          <Bullet>Reporta el ID de la pregunta (si existe) y el modo donde falló.</Bullet>
        </Section>

        {/* 8) RealExam / RealSim */}
        <Section
          title="8) Simulacro Real"
          icon={<MaterialCommunityIcons name="timer-sand" size={18} color="#EDEBFF" />}
        >
          <Text style={styles.paragraph}>
            Cuando hay un modo de examen/simulacro por sesiones, el sistema suele guardar estado:
            sesión actual, tiempo, respuestas, y si está “en progreso”. Ese guardado permite reanudar,
            pero también es la fuente del bug clásico:
            <Text style={styles.bold}> “me manda a la segunda sesión aunque no hice nada”</Text>.
          </Text>

          <SmallTitle>Por qué pasa (causas típicas)</SmallTitle>
          <Bullet>El estado “inProgress” quedó en true por cierre inesperado.</Bullet>
          <Bullet>La app reusó un estado viejo porque no se limpió al iniciar “nuevo examen”.</Bullet>
          <Bullet>Hay una condición de fecha mal calculada (“hoy” vs “ayer” vs zona horaria).</Bullet>
          <Bullet>El guardado local se corrompió (poco común, pero pasa).</Bullet>

          <SmallTitle>Qué hacer como usuario (procedimiento)</SmallTitle>
          <Bullet>Busca un botón de “Reiniciar examen / borrar sesión” si existe.</Bullet>
          <Bullet>Si no existe: cierra la app y vuelve a entrar.</Bullet>
          <Bullet>Si sigue: borra caché/almacenamiento de la app (esto puede resetear progreso).</Bullet>
          <Bullet>Si es un producto en producción: reporta el fallo para que se corrija por código.</Bullet>

          <Text style={styles.paragraph}>
            Nota: si INSQUIZ protege exámenes “oficiales”, puede evitar que borres estado sin autorización.
            Eso es normal: la integridad del simulacro importa.
          </Text>
        </Section>

        {/* 9) Datos, privacidad */}
        <Section
          title="9) Datos y privacidad: qué se guarda y qué NO"
          icon={<Ionicons name="lock-closed" size={18} color="#EDEBFF" />}
        >
          <Text style={styles.paragraph}>
            En una app como INSQUIZ, normalmente se guardan datos de uso educativo. Ejemplos:
          </Text>

          <Bullet>Progreso (respuestas correctas/incorrectas, temas practicados, etc.).</Bullet>
          <Bullet>Estado de licencia (válida/expirada) y registro básico de dispositivos.</Bullet>
          <Bullet>Eventos técnicos (errores, logs, reintentos).</Bullet>

          <SmallTitle>Qué NO se guarda</SmallTitle>
          <Bullet>Contraseñas.</Bullet>
          <Bullet>Información bancaria.</Bullet>
          <Bullet>Datos sensibles innecesarios para estudiar.</Bullet>

          <Text style={styles.paragraph}>
            Si alguna pantalla te pide información que no tiene sentido para una app educativa,
            desconfía y repórtalo. La aplicacion solo te pedira tu Nombre. No te pedira ningun otro dato personal. Si ves algo sospechoso, reportalo.
          </Text>
        </Section>

        {/* 10) Errores: guía de diagnóstico */}
        <Section
          title="10) Guía de diagnóstico"
          icon={<Ionicons name="bug" size={18} color="#EDEBFF" />}
          defaultOpen={true}
        >
          <Text style={styles.paragraph}>
            Cuando algo falla, tu misión Tu misión es recolectar evidencia. Un error sin evidencia es un fantasma: nadie lo puede arreglar bien.
            
          </Text>

          <SmallTitle>Paso 1: Clasifica el tipo de problema</SmallTitle>
          <Bullet><Text style={styles.bold}>A) Pantalla:</Text> no carga, se queda en negro, botones no responden.</Bullet>
          <Bullet><Text style={styles.bold}>B) Licencia:</Text> bloquea acceso, “expirada”, “no válida”, “max devices”.</Bullet>
          <Bullet><Text style={styles.bold}>C) Datos:</Text> progreso se pierde, preguntas repetidas, faltan justificaciones.</Bullet>
          <Bullet><Text style={styles.bold}>D) Conectividad:</Text> offline falso, no sincroniza, tarda infinito.</Bullet>
          <Bullet><Text style={styles.bold}>E) Navegación:</Text> vuelve sola, entra a sesión equivocada, loops.</Bullet>

          <SmallTitle>Paso 2: Reproduce el error</SmallTitle>
          <Bullet>¿Ocurre siempre? ¿Solo a veces? ¿En un modo específico?</Bullet>
          <Bullet>¿Después de actualizar? ¿Después de reiniciar el celular?</Bullet>
          <Bullet>¿Solo con WiFi? ¿Solo con datos?</Bullet>

          <SmallTitle>Paso 3: Captura evidencia</SmallTitle>
          <Bullet>Nombre exacto de la pantalla donde ocurrió.</Bullet>
          <Bullet>Modo (Práctica / RealExam / RealSim / etc.).</Bullet>
          <Bullet>Hora aproximada (fecha y hora local).</Bullet>
          <Bullet>Logs de consola (Expo) o Logcat si estás en Android.</Bullet>

          <SmallTitle>Paso 4: Acciones correctivas estándar</SmallTitle>
          <Bullet>Cierra la app por completo y vuelve a abrir.</Bullet>
          <Bullet>Revisa internet real (prueba abrir una web fuera de la app).</Bullet>
          <Bullet>Actualiza la app si hay versión nueva.</Bullet>
          <Bullet>Si nada sirve: reporta con evidencia.</Bullet>

        </Section>

        {/* 11) Mensajes comunes */}
        <Section
          title="11) Traducción de mensajes comunes "
          icon={<Ionicons name="chatbox-ellipses" size={18} color="#EDEBFF" />}
        >
          <SmallTitle>“No aplicable” (ERelease)</SmallTitle>
          <Text style={styles.paragraph}>
            Significa: “sí revisé si había un mensaje para ti, pero las reglas dicen que no te corresponde”
            (por licencia, commit, fecha, ya mostrado, etc.).
          </Text>

          <SmallTitle>“Max devices”</SmallTitle>
          <Text style={styles.paragraph}>
            Significa: tu licencia tiene un límite de dispositivos y ya lo alcanzaste. Solución: el admin debe liberar un cupo
            o debes usar el dispositivo ya registrado.
          </Text>

          <SmallTitle>“Offline lock” / “offlineLockPending”</SmallTitle>
          <Text style={styles.paragraph}>
            Significa: el sistema te está dando un margen sin internet, pero si no revalidas pronto, se bloquea por seguridad.
          </Text>

          <SmallTitle>“Justification undefined/null”</SmallTitle>
          <Text style={styles.paragraph}>
            Significa: la pregunta no trae justificación (dato incompleto) o la UI no la está pasando bien.
          </Text>
        </Section>

        {/* 12) Filosofía de uso */}
        <Section
          title="12) Cómo sacarle provecho real"
          icon={<Ionicons name="flame" size={18} color="#EDEBFF" />}
        >
          <Text style={styles.paragraph}>
            INSQUIZ no es para entrenar. Si quieres progreso real:
          </Text>
          <Bullet>No solo respondas: lee la justificación completa.</Bullet>
          <Bullet>Marca tus temas débiles y vuelve a ellos sistemáticamente.</Bullet>
          <Bullet>Haz simulacros con reglas (tiempo, sin distracciones) para medir desempeño real.</Bullet>
          <Bullet>Si fallas mucho, no significa que seas malo: significa que el sistema está encontrando tus grietas (bien).</Bullet>

          <Text style={styles.paragraph}>
            El objetivo de esta aplicacion es que mejores, de manera sistematica y medible. 
          </Text>
        </Section>

        {/* 13) Explicacion de conceptos */}
        <Section
          title="13) Explicacion de conceptos clave"
          icon={<Ionicons name="flame" size={18} color="#EDEBFF" />}
        >
          <Text style={styles.paragraph}>
            Algunos conceptos que debes saber para entender este manual.
          </Text>
          <Bullet> UI (Interfaz de Usuario): La parte visual de la aplicacion con la que interactuas.</Bullet>
          <Bullet> Frontend: La parte de la aplicacion que se ejecuta en tu dispositivo (celular/tablet).</Bullet>
          <Bullet> Backend: La parte de la aplicacion que se ejecuta en servidores remotos (nube).</Bullet>
          <Bullet> AsyncStorage: Almacenamiento local en el dispositivo para guardar datos de la aplicacion.</Bullet>
          
          <Text style={styles.paragraph}>
           En el futuro se añadiran mas conceptos, para facilitar la comprension del sistema.
          </Text>
        </Section>
        
    

        <Divider />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Fin del manual extremo.</Text>
          <Text style={styles.footerText}>
            Si llegaste hasta aquí, oficialmente eres del equipo que arregla problemas en vez de crear supersticiones.
          </Text>

          <View style={{ height: 10 }} />

          <View style={styles.footerRow}>
            <Pill
              tone="ok"
              icon={<Ionicons name="checkmark-circle" size={14} color="#D7FFEA" />}
              text="Diagnóstico > Pánico"
            />
            <Pill
              tone="info"
              icon={<Ionicons name="document-text" size={14} color="#DCEBFF" />}
              text="Evidencia > Opinión"
            />
          </View>

          <View style={{ height: 18 }} />

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation?.goBack?.()}
            activeOpacity={0.9}
          >
            <Ionicons name="arrow-back" size={18} color="#F5F5FF" />
            <Text style={styles.backBtnText}>Volver</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
}

// =====================================================
// Styles
// =====================================================

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#050509" },
  bg: {
    ...StyleSheet.absoluteFillObject,
  },
  scroll: {
    padding: 16,
    paddingTop: 18,
    paddingBottom: 26,
  },

  hero: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderRadius: 22,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  heroTitle: {
    color: "#F5F5FF",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  heroSubtitle: {
    color: "rgba(245,245,255,0.78)",
    fontSize: 13.5,
    lineHeight: 18.5,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },
  heroActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 14,
    flexWrap: "wrap",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  actionBtnGhost: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(59,130,246,0.12)",
    borderColor: "rgba(59,130,246,0.24)",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  actionText: {
    color: "#F5F5FF",
    fontSize: 13.5,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.10)",
    marginVertical: 16,
  },

  section: {
    marginBottom: 12,
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
    fontSize: 14.5,
    fontWeight: "900",
    flexShrink: 1,
  },
  sectionBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 2,
  },

  paragraph: {
    color: "rgba(245,245,255,0.78)",
    fontSize: 13.5,
    lineHeight: 18.5,
    marginTop: 10,
  },
  bold: { color: "#F5F5FF", fontWeight: "900" },

  smallTitle: {
    color: "#F5F5FF",
    fontSize: 13.5,
    fontWeight: "900",
    marginTop: 14,
    marginBottom: 6,
  },

  bulletRow: {
    flexDirection: "row",
    marginTop: 8,
  },
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

  codeBlock: {
    marginTop: 10,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
  },
  codeText: {
    color: "rgba(245,245,255,0.82)",
    fontSize: 12.5,
    lineHeight: 16.5,
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace", default: "monospace" }),
  },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  pillText: {
    fontSize: 12.5,
    fontWeight: "800",
  },

  footer: {
    marginTop: 8,
    padding: 14,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
  },
  footerTitle: {
    color: "#F5F5FF",
    fontSize: 16,
    fontWeight: "900",
  },
  footerText: {
    marginTop: 8,
    color: "rgba(245,245,255,0.72)",
    fontSize: 13.5,
    lineHeight: 18.5,
  },
  footerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
  },

  backBtn: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 18,
  },
  backBtnText: {
    color: "#F5F5FF",
    fontSize: 14,
    fontWeight: "900",
  },
});
