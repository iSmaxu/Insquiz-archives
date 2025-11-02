// context/QuizContext.js
import React, { createContext, useState, useEffect } from "react";
import { loadQuestions } from "../services/quizService";

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [bankStatus, setBankStatus] = useState("loading"); // "online" | "cached" | "local"
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  /**
   * Carga inicial del banco de preguntas (online, caché o local)
   */
  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await loadQuestions(setBankStatus);

      // Validamos estructura
      if (data && typeof data === "object") {
        setQuestions(data);
        setSubjects(
          Object.keys(data).map((key) => ({
            key,
            title: key.replace(/_/g, " ").toUpperCase(),
          }))
        );
      }

      setLoading(false);
    })();
  }, []);

  /**
   * Iniciar un quiz
   * @param {"full"|"subject"} mode
   * @param {string} subjectKey
   */
  const startQuiz = (mode, subjectKey) => {
    if (mode === "full") {
      const allQuestions = Object.values(questions).flat();
      const random = shuffle(allQuestions).slice(0, 25);
      setSelectedQuiz(random);
    } else if (mode === "subject" && subjectKey) {
      const subjectQuestions = questions[subjectKey] || [];
      const random = shuffle(subjectQuestions).slice(0, 5);
      setSelectedQuiz(random);
    }
  };

  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

  return (
    <QuizContext.Provider
      value={{
        loading,
        subjects,
        bankStatus,
        questions,
        selectedQuiz,
        startQuiz,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};
