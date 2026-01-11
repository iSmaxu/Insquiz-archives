// App/components/EReleaseModal.js
// =============================================
// Modal simple para mostrar release_message
// =============================================

import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function EReleaseModal({ dispatch, onClose }) {
  if (!dispatch) return null;

  const { payload } = dispatch;
  if (payload?.type !== "release_message") return null;

  return (
    <Modal transparent animationType="fade" visible>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{payload.title}</Text>

          {Array.isArray(payload.changes) &&
            payload.changes.map((c, i) => (
              <Text key={i} style={styles.line}>
                • {c}
              </Text>
            ))}

          {payload.footer && (
            <Text style={styles.footer}>{payload.footer}</Text>
          )}

          <TouchableOpacity onPress={onClose} style={styles.btn}>
            <Text style={styles.btnText}>Entendido</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#0b0b16",
    borderRadius: 18,
    padding: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f5f5ff",
    marginBottom: 10,
  },
  line: {
    color: "#e5e7eb",
    marginBottom: 6,
  },
  footer: {
    marginTop: 12,
    fontSize: 12,
    color: "#a6a8c3",
  },
  btn: {
    marginTop: 14,
    backgroundColor: "#7c3aed",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
  },
});
