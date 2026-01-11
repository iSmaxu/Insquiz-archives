import React, { createContext, useContext, useEffect, useState } from "react";
import { INITIAL_INSTRUCTOR_STATE } from "./InstructorState";
import { handleInstructorEvent } from "./InstructorEngine";
import {
  loadInstructorState,
  saveInstructorState,
} from "./InstructorStorage";
import { INSTRUCTOR_ENABLED } from "./instructor.config";

const InstructorContext = createContext(null);

export function InstructorProvider({ children }) {
  // 🔌 APAGADO TOTAL
  if (!INSTRUCTOR_ENABLED) {
    return children;
  }

  const [state, setState] = useState(INITIAL_INSTRUCTOR_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadInstructorState().then((stored) => {
      if (stored) setState(stored);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (ready) {
      saveInstructorState(state);
    }
  }, [state, ready]);

  function dispatch(event) {
    if (!INSTRUCTOR_ENABLED) return;
    setState((prev) => handleInstructorEvent(prev, event));
  }

  if (!ready) return null;

  return (
    <InstructorContext.Provider value={{ state, dispatch }}>
      {children}
    </InstructorContext.Provider>
  );
}

export function useInstructor() {
  return useContext(InstructorContext);
}
