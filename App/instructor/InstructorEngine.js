import { InstructorEvents } from "./InstructorEvents";

export function handleInstructorEvent(state, event) {
  if (state.dismissed) return state;

  switch (event.type) {
    case InstructorEvents.PRACTICE_COMPLETED:
      return advance(state, 1);

    case InstructorEvents.JUSTIFICATION_VIEWED:
      return advance(state, 2);

    case InstructorEvents.ABOUT_OPENED:
      return advance(state, 3);

    case InstructorEvents.ADVANCED_MODE_STARTED:
      return advance(state, 4);

    default:
      return state;
  }
}

function advance(state, step) {
  if (state.completedSteps.includes(step)) return state;

  return {
    ...state,
    completedSteps: [...state.completedSteps, step],
    currentStep: Math.min(step + 1, 4),
    lastNudgeAt: Date.now(),
  };
}
