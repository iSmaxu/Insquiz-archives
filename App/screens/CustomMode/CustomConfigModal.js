// ==========================================================
//  INSQUIZ - CustomConfigModal (Configurar cantidad y materia)
// ==========================================================

import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";

// Importamos los bancos fragmentados
import CN from "../../data/converted_questions/cn";
import CS from "../../data/converted_questions/cs";
import EN from "../../data/converted_questions/en";
import LQ from "../../data/converted_questions/lq";
import MT from "../../data/converted_questions/mt";

const DB_MAP = {
  "ciencias_naturales": CN,
  "ciencias_sociales": CS,
  "ingles": EN,
  "lectura": LQ,
  "matematicas": MT,
};

export default function CustomConfigModal({
  visible,
  onClose,
  navigation,
  subject,
  subjectLabel,
}) {
  const [count, setCount] = useState(10);

  const OPTIONS = [5, 10, 20, 40, 60, 80, 100, 150];

  const startQuiz = () => {
    const all = DB_MAP[subject] || [];

    const shuffled = all.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, count);

    navigation.navigate("QuizScreen", {
      mode: "custom",
      subject,
      subjectLabel,
      count,
      questions: selected,
    });

    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={{
        flex: 1, justifyContent: "center", alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.6)"
      }}>
        <View style={{
          width: "85%",
          backgroundColor: "#141320",
          padding: 20,
          borderRadius: 20,
          borderColor: "#26263a",
          borderWidth: 1
        }}>
          <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>
            {subjectLabel}
          </Text>

          <Text style={{ color: "#bbb", marginTop: 15, fontSize: 16 }}>
            ¿Cuántas preguntas deseas hacer?
          </Text>

          <FlatList
            horizontal
            data={OPTIONS}
            keyExtractor={(i) => i.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setCount(item)}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  marginRight: 10,
                  borderRadius: 12,
                  backgroundColor: item === count ? "#ff2b2b" : "#26263a"
                }}>
                <Text style={{ color: "#fff", fontWeight: "600" }}>{item}</Text>
              </TouchableOpacity>
            )}
          />

          <TouchableOpacity
            onPress={startQuiz}
            style={{
              backgroundColor: "#ff2b2b",
              padding: 15,
              borderRadius: 15,
              marginTop: 20
            }}>
            <Text style={{
              color: "#fff",
              textAlign: "center",
              fontSize: 18,
              fontWeight: "bold"
            }}>
              Iniciar Quiz
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={{ marginTop: 10 }}>
            <Text style={{ color: "#aaa", textAlign: "center" }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
