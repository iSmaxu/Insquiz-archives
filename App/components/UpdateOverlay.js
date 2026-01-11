// ==========================================================
//    INSQUIZ — UpdateOverlay (banner + mini bolita)
// ==========================================================

import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useUpdateInfo, QUIZ_SCREENS } from "../updates/UpdateContext";

export default function UpdateOverlay({ currentRouteName }) {
  const { updateAvailable, updateMessage, applyUpdate } = useUpdateInfo();
  const [expanded, setExpanded] = useState(false);

  if (!updateAvailable) return null;

  const isQuiz = QUIZ_SCREENS.includes(currentRouteName);

  // ⚠️ Caso 1: NO estas en quiz → update OBLIGATORIA + bloqueo total
  if (!isQuiz) {
    return (
      <View style={styles.blockRoot} pointerEvents="box-none">
        <View style={styles.blockLayer} />
        <View style={styles.dialog}>
          <Text style={styles.title}>🔴 Actualización obligatoria</Text>
          <Text style={styles.msg} numberOfLines={3}>
            {updateMessage}
          </Text>
          <Pressable style={styles.btn} onPress={applyUpdate}>
            <Text style={styles.btnText}>Actualizar ahora</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ⚠️ Caso 2: estás dentro de un quiz → mini bolita expandible
  return (
    <View style={styles.quizRoot} pointerEvents="box-none">
      {!expanded ? (
        <Pressable style={styles.bolita} onPress={() => setExpanded(true)}>
          <Text style={styles.bolitaText}>⚡</Text>
        </Pressable>
      ) : (
        <View style={styles.miniCard}>
          <Text style={styles.miniTitle}>🔄 Update disponible</Text>
          <Text style={styles.miniMsg} numberOfLines={2}>
            {updateMessage}
          </Text>

          <Pressable style={styles.miniUpdate} onPress={applyUpdate}>
            <Text style={styles.miniUpdateText}>Actualizar ahora</Text>
          </Pressable>

          <Pressable style={styles.continueBtn} onPress={() => setExpanded(false)}>
            <Text style={styles.continueText}>Seguir pracitcando</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // ---------- Pantallas bloqueadas ---------
  blockRoot: {
    position: "absolute",
    inset: 0,
    zIndex: 999,
    justifyContent: "center",
    alignItems: "center"
  },
  blockLayer: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  dialog: {
    width: "85%",
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#141320",
    borderWidth: 1,
    borderColor: "#ff2b2b",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ff2b2b",
    marginBottom: 10,
  },
  msg: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: "#ff2b2b",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  // ---------- Quiz bolita ---------
  quizRoot: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 900,
  },
  bolita: {
    backgroundColor: "#ff2b2b",
    width: 38,
    height: 38,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  bolitaText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  miniCard: {
    width: 250,
    padding: 12,
    backgroundColor: "#141320",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ff2b2b",
  },
  miniTitle: {
    color: "#ff2b2b",
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 4,
  },
  miniMsg: {
    color: "#fff",
    fontSize: 12,
    marginBottom: 12,
  },
  miniUpdate: {
    backgroundColor: "#ff2b2b",
    borderRadius: 999,
    paddingVertical: 6,
    alignItems: "center",
    marginBottom: 6,
  },
  miniUpdateText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  continueBtn: {
    alignSelf: "center",
    paddingVertical: 4,
  },
  continueText: {
    color: "#ccc",
    fontSize: 12,
  },
});
