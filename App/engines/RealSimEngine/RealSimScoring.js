// ==========================================================
// INSQUIZ — RealSimScoring
// Reporte básico: accuracy global y por materia
// ==========================================================

function subjectsBase() {
  return {
    lectura_critica: { total: 0, correct: 0 },
    matematicas: { total: 0, correct: 0 },
    ciencias_sociales: { total: 0, correct: 0 },
    ciencias_naturales: { total: 0, correct: 0 },
    ingles: { total: 0, correct: 0 },
  };
}

export default function scoreRealSim({ examPack, state }) {
  const subs = subjectsBase();

  const all = [
    ...(examPack.sessions.session1 || []),
    ...(examPack.sessions.session2 || []),
  ];

  let total = 0;
  let correct = 0;

  for (const q of all) {
    total++;
    const s = q.subject;
    if (subs[s]) subs[s].total++;

    const user = state.answers?.[q.id];
    const ok = (user || "").toUpperCase() === (q.correct_letter || q.answer || "").toUpperCase();

    if (ok) {
      correct++;
      if (subs[s]) subs[s].correct++;
    }
  }

  const pct = total > 0 ? (correct / total) * 100 : 0;

  return {
    summary: {
      total,
      correct,
      pct: Math.round(pct * 10) / 10,
    },
    subjects: Object.fromEntries(
      Object.entries(subs).map(([k, v]) => {
        const p = v.total > 0 ? (v.correct / v.total) * 100 : 0;
        return [k, { ...v, pct: Math.round(p * 10) / 10 }];
      })
    ),
  };
}
