// App/context/QuizContext.js
// ==========================================================
// INSQUIZ - Quiz Context (estado global)
// ==========================================================
import React, { createContext, useState } from "react";

export const QuizContext = createContext();

export function QuizProvider({ children }) {
  const [progress, setProgress] = useState({});
  const [lastSubject, setLastSubject] = useState(null);

  const updateProgress = (subject, correct, total) => {
    setProgress((prev) => {
      const prevData = prev[subject] || { correct: 0, total: 0 };
      return {
        ...prev,
        [subject]: {
          correct: prevData.correct + correct,
          total: prevData.total + total,
        },
      };
    });
  };

  return (
    <QuizContext.Provider
      value={{
        progress,
        updateProgress,
        lastSubject,
        setLastSubject,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}
