import React, { useContext, useState } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { QuizContext } from "../context/QuizContext";

export default function QuizScreen({ navigation }) {
  const { selectedQuiz } = useContext(QuizContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  if (!selectedQuiz || selectedQuiz.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No hay preguntas disponibles.</Text>
        <Button title="Volver al inicio" onPress={() => navigation.navigate("Home")} />
      </View>
    );
  }

  const current = selectedQuiz[currentIndex];

  const handleAnswer = (option) => {
    setAnswered(true);
    if (option === current.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < selectedQuiz.length) {
      setCurrentIndex(currentIndex + 1);
      setAnswered(false);
    } else {
      navigation.navigate("RealSimReview", { score, total: selectedQuiz.length });
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Pregunta {currentIndex + 1} de {selectedQuiz.length}
      </Text>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
        {current.question}
      </Text>
      {current.options.map((option, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => handleAnswer(option)}
          disabled={answered}
          style={{
            backgroundColor: answered
              ? option === current.answer
                ? "#a0e3a0"
                : "#f2f2f2"
              : "#eaeaea",
            padding: 15,
            borderRadius: 10,
            marginVertical: 5,
          }}
        >
          <Text>{option}</Text>
        </TouchableOpacity>
      ))}
      {answered && (
        <Button
          title={
            currentIndex + 1 < selectedQuiz.length
              ? "Siguiente pregunta"
              : "Finalizar quiz"
          }
          onPress={handleNext}
        />
      )}
    </View>
  );
}
