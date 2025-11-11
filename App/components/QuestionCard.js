// App/components/QuestionCard.js
// ==========================================================
// INSQUIZ - QuestionCard (versión final con context_text real)
// ==========================================================
// Muestra el contexto completo desde data/textos_***.json
// usando el "context" de la pregunta como context_title.
// ==========================================================
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Vibration,
} from "react-native";
import { getTextForQuestion } from "../services/textService";

export default function QuestionCard({ question, index, total, onNext }) {
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [showJustification, setShowJustification] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const timerRef = useRef(null);

  // 👇 Buscamos el contexto completo desde /data/textos
  const contextData = getTextForQuestion(question);

  useEffect(() => {
    // limpiar timers y estado cuando cambie la pregunta
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [question]);

  const handleSelect = (opt) => {
    if (locked) return;
    const normalizedOpt = typeof opt === "string" ? opt.trim() : opt;
    const correctAns = (question.answer || "").trim();

    const correct =
      normalizedOpt === correctAns || normalizedOpt === question.answer;

    setSelected(normalizedOpt);
    setIsCorrect(Boolean(correct));
    setLocked(true);

    // vibrar fuerte si es incorrecta
    if (!correct) {
      // patrón: pausa, vibración larga, corta
      Vibration.vibrate([0, 400, 100, 200]);
    }

    // mostramos la justificación inmediatamente
    setShowJustification(true);

    // mostramos el botón siguiente después de 250ms
    timerRef.current = setTimeout(() => {
      setShowNext(true);
      timerRef.current = null;
    }, 250);
  };

  return (
    <ScrollView style={styles.card}>
      {/* ====== CONTEXTO ====== */}
      {contextData && (
        <View style={styles.contextBox}>
          <Text style={styles.contextTitle}>
            {contextData.context_title || "Contexto"}
          </Text>
          <Text style={styles.contextBody}>
            {contextData.context_text || "Sin contexto disponible."}
          </Text>
        </View>
      )}

      {/* ====== PREGUNTA ====== */}
      <Text style={styles.question}>
        {index + 1}. {question.question}
      </Text>

      {/* ====== OPCIONES ====== */}
      {question.options &&
        question.options.map((opt, i) => {
          const optText = typeof opt === "string" ? opt.trim() : opt;
          const correctAns = (question.answer || "").trim();
          const isThisCorrect = optText === correctAns;
          const isThisSelected = selected !== null && selected === optText;

          let bg = "#fff";
          let borderColor = "#ddd";
          let textColor = "#333";

          if (locked) {
            if (isThisCorrect) {
              bg = "#c8e6c9"; // verde claro
              borderColor = "#28a745";
            }

            if (!isCorrect && isThisSelected) {
              // el usuario eligió mal -> su opción en rojo
              bg = "#ffcdd2"; // rojo claro
              borderColor = "#d93025";
              textColor = "#8a0000";
            }
          }

          return (
            <TouchableOpacity
              key={i}
              style={[styles.option, { backgroundColor: bg, borderColor }]}
              onPress={() => handleSelect(opt)}
              activeOpacity={0.7}
              disabled={locked}
            >
              <Text style={[styles.optionText, { color: textColor }]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}

      {/* justificación */}
      {showJustification && (
        <View style={styles.justificationBox}>
          <Text style={styles.justificationTitle}>Justificación</Text>
          <Text style={styles.justificationText}>
            {question.justification || question.justificacion || "Sin justificación disponible."}
          </Text>
        </View>
      )}

      {/* botón siguiente */}
      {showNext && (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => {
            // enviar resultado al padre y limpiar estado
            onNext && onNext(Boolean(isCorrect));
            setSelected(null);
            setLocked(false);
            setShowJustification(false);
            setShowNext(false);
            setIsCorrect(null);
            if (timerRef.current) {
              clearTimeout(timerRef.current);
              timerRef.current = null;
            }
          }}
        >
          <Text style={styles.nextText}>Siguiente ➜</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

// ==========================================================
// 🎨 ESTILOS
// ==========================================================
const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  contextBox: {
    backgroundColor: "#f3f2ff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  contextTitle: {
    fontWeight: "bold",
    color: "#6a0dad",
    marginBottom: 6,
    fontSize: 16,
  },
  contextBody: {
    color: "#333",
    lineHeight: 20,
    fontSize: 15,
  },
  question: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 12,
    color: "#222",
  },
  option: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  optionText: {
    color: "#333",
  },
});
