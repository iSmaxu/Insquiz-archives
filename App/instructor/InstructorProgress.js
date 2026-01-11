import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function InstructorProgress({ currentStep }) {
  const steps = [
    "Practicar",
    "Revisar justificaciones",
    "Conocer InsQUIZ",
    "Explorar avanzado",
  ];

  return (
    <View style={styles.container}>
      {steps.map((s, i) => {
        const step = i + 1;
        return (
          <View key={s} style={styles.row}>
            <View
              style={[
                styles.dot,
                step < currentStep && styles.done,
                step === currentStep && styles.active,
              ]}
            />
            <Text
              style={[
                styles.text,
                step === currentStep && styles.activeText,
              ]}
            >
              {s}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#272739",
    paddingTop: 10,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  dot: { width: 8, height: 8, borderRadius: 8, backgroundColor: "#555", marginRight: 8 },
  done: { backgroundColor: "#4cc9f0" },
  active: { backgroundColor: "#fff" },
  text: { fontSize: 13, color: "#a2a4c1" },
  activeText: { color: "#fff", fontWeight: "600" },
});
