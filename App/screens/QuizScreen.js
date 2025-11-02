// screens/QuizScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { loadQuestions } from "../services/quizService";
import QuestionCard from "../components/QuestionCard";

export default function QuizScreen() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    (async () => {
      const q = await loadQuestions();
      setQuestions(q.lectura || []);
      setLoading(false);
    })();
  }, []);

  const handleAnswer = () => {
    if (index + 1 < questions.length) setIndex(index + 1);
    else setFinished(true);
  };

  if (loading)
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Cargando preguntas...</Text>
      </View>
    );

  if (finished)
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎉 ¡Quiz completado!</Text>
        <Text>Preguntas totales: {questions.length}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <QuestionCard
        question={questions[index]}
        index={index}
        total={questions.length}
        onAnswer={handleAnswer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
});
