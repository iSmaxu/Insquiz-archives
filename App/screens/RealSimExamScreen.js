// ==========================================================
// INSQUIZ — RealSimExamScreen
// - Tiempo por sesión activo (persistente)
// - MARCAR congela respuesta
// - Desmarcar permite modificar
// - Corte automático por tiempo
// ==========================================================

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  AppState,
  Alert,
  StyleSheet,
} from "react-native";

import RealSimEngine from "../engines/RealSimEngine";
import insquizMaster from "../data/converted_questions/insquiz_master";
import StimulusRenderer from "../components/StimulusRenderer";

// ----------------------------------------------------------
function optionsToEntries(options) {
  if (options && typeof options === "object" && !Array.isArray(options)) {
    return ["A", "B", "C", "D"]
      .filter((k) => options[k] != null && String(options[k]).length > 0)
      .map((k) => [k, String(options[k])]);
  }
  return [];
}

function formatTime(ms) {
  if (ms == null) return "";
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h}:${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;
}

// ----------------------------------------------------------
export default function RealSimExamScreen({ navigation }) {
  const [examPack, setExamPack] = useState(null);
  const [state, setState] = useState(null);

  // -------------------------
  // Carga inicial
  // -------------------------
  useEffect(() => {
    let mounted = true;

    async function load() {
      const saved = await RealSimEngine.StateStore.loadRealSimState();

      if (!saved || saved.completed) {
        navigation.replace("Home");
        return;
      }

      let pack = global.__REALSIM_EXAM__;
      if (!pack) {
        pack = RealSimEngine.assembleRealSim({
          bank: insquizMaster,
          recentQuestionIds: [],
          seed: saved.meta?.seed || Date.now(),
        });
        global.__REALSIM_EXAM__ = pack;
      }

      if (!mounted) return;
      setExamPack(pack);
      setState(saved);
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  // -------------------------
  // Guardado por cierre/crash
  // -------------------------
  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      if (next !== "active" && state) {
        RealSimEngine.StateStore.saveRealSimState(state);
      }
    });
    return () => sub.remove();
  }, [state]);

  // -------------------------
  // Corte automático por tiempo
  // -------------------------
  useEffect(() => {
    if (!state || !examPack) return;

    const expired = RealSimEngine.StateStore.isTimeExpired(state);
    if (!expired) return;

    // tiempo agotado
    if (state.progress.session === "session1") {
      const updated = RealSimEngine.StateStore.nextQuestion(state, examPack);
      setState(updated);
      RealSimEngine.StateStore.saveRealSimState(updated);
    } else {
      RealSimEngine.History.finalizeAttempt({
        state,
        examPack,
        endedReason: "time_expired",
      }).then(() => {
        navigation.replace("RealSimResults");
      });
    }
  }, [state, examPack]);

  // -------------------------
// Tick visual del reloj (1s)
// -------------------------
const [, forceTick] = useState(0);
useEffect(() => {
  const id = setInterval(() => {
    forceTick(t => t + 1);
  }, 1000);

  return () => clearInterval(id);
}, []);


  // -------------------------
  // Loading
  // -------------------------
  if (!examPack || !state) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>Cargando simulacro…</Text>
      </View>
    );
  }

  const sessionKey = state.progress.session;
  const questions = examPack.sessions?.[sessionKey];

  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>Cargando preguntas…</Text>
      </View>
    );
  }

  const qIndex = state.progress.questionIndex;
  const q = questions[qIndex];

  if (!q) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>Cargando pregunta…</Text>
      </View>
    );
  }

  const selected = state.answers?.[q.id] || null;
  const entries = optionsToEntries(q.options);
  const isMarked = Array.isArray(state.marked)
    ? state.marked.includes(q.id)
    : false;

  const remainingMs = RealSimEngine.StateStore.remainingTimeMs(state);

  // -------------------------
  // Acciones
  // -------------------------
  function selectAnswer(letter) {
    const updated = RealSimEngine.StateStore.recordAnswer(
      { ...state },
      q.id,
      letter
    );
    setState(updated);
    RealSimEngine.StateStore.saveRealSimState(updated);
  }

  function next() {
    const updated = RealSimEngine.StateStore.nextQuestion(state, examPack);

    if (updated.completed) {
      RealSimEngine.StateStore.saveRealSimState(updated).then(async () => {
        await RealSimEngine.History.finalizeAttempt({
          state: updated,
          examPack,
          endedReason: "completed",
        });
        navigation.replace("RealSimResults");
      });
      setState(updated);
      return;
    }

    setState(updated);
    RealSimEngine.StateStore.saveRealSimState(updated);
  }

  function prev() {
    const updated = RealSimEngine.StateStore.previousQuestion({ ...state });
    setState(updated);
    RealSimEngine.StateStore.saveRealSimState(updated);
  }

  function toggleMark() {
  const currentAnswer = state.answers?.[q.id];

  if (!currentAnswer) {
    Alert.alert(
      "No se puede marcar",
      "Para poder marcar debes elegir una respuesta, o pasar a la siguiente y marcar después."
    );
    return;
  }

  const updated = RealSimEngine.StateStore.toggleMark(
    { ...state },
    q.id
  );
  setState(updated);
  RealSimEngine.StateStore.saveRealSimState(updated);
}


  async function exitVoluntary() {
    Alert.alert(
      "Salir del simulacro",
      "Si usted sale voluntariamente, el simulacro se reiniciará.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salir",
          style: "destructive",
          onPress: async () => {
            await RealSimEngine.History.finalizeAttempt({
              state,
              examPack,
              endedReason: "voluntary_exit",
            });
            await RealSimEngine.StateStore.clearRealSimState();
            global.__REALSIM_EXAM__ = null;
            navigation.replace("RealSimIntro");
          },
        },
      ]
    );
  }

  // -------------------------
  // Render
  // -------------------------
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerSession}>
            {sessionKey === "session1" ? "Sesión 1 de 2" : "Sesión 2 de 2"}
          </Text>
          <Text style={styles.headerProgress}>
            Pregunta {qIndex + 1} de {questions.length}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <Text style={styles.timer}>⏱️ {formatTime(remainingMs)}</Text>
          <TouchableOpacity onPress={exitVoluntary} style={styles.exitBtn}>
            <Text style={styles.exitText}>Salir</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENIDO */}
      <ScrollView contentContainerStyle={styles.content}>
        {q.context?.text ? (
          <View style={styles.contextBox}>
            <Text style={styles.contextText}>{q.context.text}</Text>
          </View>
        ) : null}

        {q.context?.visual ? (
          <View style={styles.visualBox}>
            <StimulusRenderer visual={q.context.visual} />
          </View>
        ) : null}

        <Text style={styles.question}>{q.question}</Text>

        <View style={styles.options}>
          {entries.map(([letter, text]) => {
            const active = selected === letter;
            return (
              <TouchableOpacity
                key={letter}
                disabled={isMarked}
                onPress={() => selectAnswer(letter)}
                style={[
                  styles.option,
                  active && styles.optionActive,
                  isMarked && styles.optionLocked,
                ]}
              >
                <Text
                  style={[
                    styles.optionLetter,
                    active && styles.optionLetterActive,
                  ]}
                >
                  {letter}
                </Text>
                <Text style={styles.optionText}>{text}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={prev}
          disabled={qIndex === 0}
          style={[styles.footerBtn, qIndex === 0 && styles.footerBtnDisabled]}
        >
          <Text style={styles.footerBtnText}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={toggleMark}
          style={[
            styles.footerBtn,
            styles.footerBtnCenter,
            isMarked && styles.footerBtnMarked,
          ]}
        >
          <Text style={styles.footerBtnText}>
            {isMarked ? "MARCADO" : "MARCAR"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={next} style={styles.footerBtn}>
          <Text style={styles.footerBtnText}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ----------------------------------------------------------
// STYLES
// ----------------------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loading: { color: "#555" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fafafa",
  },
  headerSession: { fontSize: 13, color: "#6a0dad", fontWeight: "800" },
  headerProgress: { fontSize: 12, color: "#555", marginTop: 2 },

  headerRight: { alignItems: "flex-end" },
  timer: { fontSize: 12, fontWeight: "700", color: "#333", marginBottom: 4 },

  exitBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  exitText: { fontWeight: "800", color: "#6a0dad" },

  content: { padding: 16, paddingBottom: 40 },
  contextBox: {
    backgroundColor: "#f6f6fb",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  contextText: { fontSize: 14, lineHeight: 20, color: "#222" },
  visualBox: { alignItems: "center", marginBottom: 16 },

  question: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
    marginBottom: 18,
  },

  options: { gap: 10 },
  option: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  optionActive: { borderColor: "#6a0dad", backgroundColor: "#f3e9ff" },
  optionLocked: { opacity: 0.5 },
  optionLetter: { fontWeight: "900", marginRight: 10, color: "#444" },
  optionLetterActive: { color: "#6a0dad" },
  optionText: { flex: 1, fontSize: 14, color: "#222" },

  footer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fafafa",
  },
  footerBtn: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#6a0dad",
  },
  footerBtnCenter: { backgroundColor: "#6a0dad" },
  footerBtnMarked: { backgroundColor: "#4b0082" },
  footerBtnDisabled: { opacity: 0.35 },
  footerBtnText: { color: "#fff", fontWeight: "900", fontSize: 16 },
});
