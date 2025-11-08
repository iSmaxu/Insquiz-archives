// App/context/QuizContext.js
import React, { createContext, useState, useEffect } from "react";
import { loadQuestionsCache, prepareQuizFromSubject } from "../services/quizService";
import InitialLoader from "../components/InitialLoader";

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [questionsBank, setQuestionsBank] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await loadQuestionsCache((progress) => {
        // opcional: manejar progreso
      });
      setQuestionsBank(data || {});
      setSubjects(Object.keys(data || {}));
      setLoading(false);
    })();
  }, []);

  const startQuiz = (subjectKey, count = 10) => {
    let pool = [];
    if (!subjectKey || subjectKey === "lectura") {
      pool = questionsBank["lectura"] || [];
    } else if (subjectKey === "all") {
      pool = Object.values(questionsBank).flat();
    } else {
      pool = questionsBank[subjectKey] || [];
    }

    const quiz = prepareQuizFromSubject(pool, count);
    setSelectedQuiz(quiz);
  };

  if (loading) return <InitialLoader />;

  return (
    <QuizContext.Provider
      value={{ questionsBank, subjects, startQuiz, selectedQuiz }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export default QuizProvider;

