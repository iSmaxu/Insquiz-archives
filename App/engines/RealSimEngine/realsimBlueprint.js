// ==========================================================
// INSQUIZ — RealSim Blueprint (254)
// ==========================================================

const realsimBlueprint = {
  exam: {
    totalQuestions: 254,
    sessionsCount: 2,
  },
  sessions: {
    session1: {
      label: "Sesión 1",
      timeLimitMs: 16200000, // 4h 30m
      subjects: [
        { subject: "lectura_critica", count: 41 },
        { subject: "matematicas", count: 25 },
        { subject: "ciencias_sociales", count: 25 },
        { subject: "ciencias_naturales", count: 29 },
      ],
    },
    session2: {
      label: "Sesión 2",
      timeLimitMs: 16200000, // 4h 30m
      subjects: [
        { subject: "matematicas", count: 25 },
        { subject: "ciencias_sociales", count: 25 },
        { subject: "ciencias_naturales", count: 29 },
        { subject: "ingles", count: 55 },
      ],
    },
  },
};

export default realsimBlueprint;
