import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from "react-native";

import CN from "../data/converted_questions/cn";
import CS from "../data/converted_questions/cs";
import EN from "../data/converted_questions/en";
import LQ from "../data/converted_questions/lq";
import MT from "../data/converted_questions/mt";

const SUBJECT_MAP = {
  lectura_critica: LQ,
  matematicas: MT,
  ciencias_sociales: CS,
  ciencias_naturales: CN,
  ingles: EN,
};

export default function CustomPracticeModal({ visible, onClose, navigation }) {
  const [count, setCount] = useState("");
  const [selected, setSelected] = useState(null);

  const SUBJECTS = [
    { id: "lectura_critica", label: "Lectura Crítica" },
    { id: "matematicas", label: "Matemáticas" },
    { id: "ciencias_sociales", label: "Ciencias Sociales" },
    { id: "ciencias_naturales", label: "Ciencias Naturales" },
    { id: "ingles", label: "Inglés" },
    { id: "azar", label: "AZAR" },
  ];

  function generateRandomProportional(total) {
    let banks = Object.values(SUBJECT_MAP);
    let totalQuestions = banks.reduce((acc, b) => acc + b.length, 0);

    let result = [];

    Object.keys(SUBJECT_MAP).forEach((key) => {
      const bank = SUBJECT_MAP[key];
      const proportion = bank.length / totalQuestions;
      const amount = Math.max(1, Math.round(total * proportion));

      const shuffled = [...bank].sort(() => 0.5 - Math.random());
      result.push(...shuffled.slice(0, amount));
    });

    return result.sort(() => 0.5 - Math.random());
  }

  function validateAndStart() {
    const num = parseInt(count);

    if (isNaN(num)) {
      Alert.alert("Error", "Debe escribir un número válido.");
      return;
    }
    if (num < 1) {
      Alert.alert("Error", "Debe elegir al menos 1 pregunta.");
      return;
    }
    if (num > 150) {
      Alert.alert("Error", "El máximo permitido es 150 preguntas.");
      return;
    }

    if (!selected) {
      Alert.alert("Error", "Debe seleccionar una materia.");
      return;
    }

    let questions = [];

    if (selected === "azar") {
      questions = generateRandomProportional(num);
      navigation.navigate("QuizScreen", {
        mode: "custom",
        subject: "azar",
        subjectLabel: "Modo Azar",
        count: num,
        questions,
      });
    } else {
      const bank = SUBJECT_MAP[selected];
      const shuffled = [...bank].sort(() => 0.5 - Math.random());
      questions = shuffled.slice(0, num);

      const subjectLabel = SUBJECTS.find((s) => s.id === selected).label;

      navigation.navigate("QuizScreen", {
        mode: "custom",
        subject: selected,
        subjectLabel,
        count: num,
        questions,
      });
    }

    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.55)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "#141320",
            width: "82%",
            paddingVertical: 22,
            paddingHorizontal: 20,
            borderRadius: 22,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.12)",
            shadowColor: "#6a0dad",
            shadowOpacity: 0.45,
            shadowRadius: 18,
            elevation: 18,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 22,
              fontWeight: "bold",
              marginBottom: 15,
              textAlign: "center",
            }}
          >
            Modo Personalizado
          </Text>

          {/* INPUT DE CANTIDAD */}
          <Text style={{ color: "#bbb", marginBottom: 6 }}>
            ¿Cuántas preguntas desea realizar?
          </Text>

          <TextInput
            value={count}
            onChangeText={(t) => setCount(t.replace(/[^0-9]/g, ""))}
            keyboardType="numeric"
            placeholder="Ej: 25"
            placeholderTextColor="#777"
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              padding: 12,
              borderRadius: 12,
              color: "white",
              marginBottom: 20,
            }}
          />

          <Text
            style={{
              color: "#bbb",
              marginBottom: 8,
            }}
          >
            Materia que desea realizar:
          </Text>

          {SUBJECTS.map((s) => (
            <TouchableOpacity
              key={s.id}
              onPress={() => setSelected(s.id)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  borderWidth: 2,
                  borderColor: selected === s.id ? "#ff2b2b" : "#aaa",
                  backgroundColor:
                    selected === s.id ? "#ff2b2b" : "transparent",
                  marginRight: 12,
                }}
              />

              <Text style={{ color: "white", fontSize: 15 }}>{s.label}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={validateAndStart}
            style={{
              backgroundColor: "#ff2b2b",
              marginTop: 20,
              paddingVertical: 12,
              borderRadius: 15,
            }}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Iniciar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={{ marginTop: 12 }}>
            <Text style={{ color: "#aaa", textAlign: "center" }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
