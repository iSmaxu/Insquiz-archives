// ==========================================================
//  INSQUIZ - CustomModeScreen
// ==========================================================

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CustomConfigModal from "./CustomConfigModal";

export default function CustomModeScreen({ navigation }) {
  const [modalData, setModalData] = useState({
    visible: false,
    subject: null,
    label: null,
  });

  const SUBJECTS = [
    { id: "lectura", label: "Lectura Crítica" },
    { id: "matematicas", label: "Matemáticas" },
    { id: "ciencias_sociales", label: "Ciencias Sociales" },
    { id: "ciencias_naturales", label: "Ciencias Naturales" },
    { id: "ingles", label: "Inglés" },
  ];

  const openModal = (subject, label) => {
    setModalData({ visible: true, subject, label });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modo Personalizado</Text>

      {SUBJECTS.map((s) => (
        <TouchableOpacity
          key={s.id}
          style={styles.card}
          onPress={() => openModal(s.id, s.label)}
        >
          <Text style={styles.cardText}>{s.label}</Text>
        </TouchableOpacity>
      ))}

      <CustomConfigModal
        visible={modalData.visible}
        onClose={() => setModalData({ visible: false, subject: null })}
        navigation={navigation}
        subject={modalData.subject}
        subjectLabel={modalData.label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: "#050509" },
  title: { fontSize: 26, color: "white", marginBottom: 20, fontWeight: "bold" },
  card: {
    backgroundColor: "#141320",
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#26263a",
  },
  cardText: { fontSize: 20, color: "white" },
});
