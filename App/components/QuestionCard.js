// App/components/QuestionCard.js
// ==========================================================
//  INSQUIZ - QuestionCard PRO
// ==========================================================
// - Muestra contexto, pregunta y opciones
// - Marca en verde/rojo según acierto
// - Resalta la correcta cuando fallas
// - Vibra fuerte si te equivocas
// - Muestra justificación
// - NO avanza solo: aparece botón "Siguiente" tras 250 ms
// - Envía skill al onNext: onNext(wasCorrect, selectedText, skill, isLast)
// ==========================================================

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
} from "react-native";

export default function QuestionCard({
  question,
  index,
  total,
  onNext,
  currentScore,
}) {
  const [selected, setSelected] = useState(null);
  const [wasCorrect, setWasCorrect] = useState(null); // true/false
  const [locked, setLocked] = useState(false);
  const [showNext, setShowNext] = useState(false);

  if (!question) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Cargando pregunta...</Text>
      </View>
    );
  }

  const options = question.options || [];
  const correctText = (question.answer || "").trim();
  const skill = question.skill || "Habilidad no definida";

  const isLast = index + 1 >= total;

  const handlePress = (opt) => {
    if (locked) return;

    const chosenText = (opt || "").trim();
    const correct = chosenText === correctText;

    console.log(
      "[handlePress] chosenText=",
      chosenText,
      "correctText=",
      correctText,
      "correct=",
      correct
    );

    setSelected(chosenText);
    setWasCorrect(correct);
    setLocked(true);

    if (!correct) {
      // Vibración fuerte al fallar
      Vibration.vibrate(250);
    }

    // Mostrar botón Siguiente tras 250 ms
    setTimeout(() => {
      setShowNext(true);
    }, 250);
  };

  const handleNext = () => {
    if (wasCorrect === null) return;

    onNext(
      wasCorrect,
      selected,
      skill,    // 🔹 enviamos la skill de la pregunta
      isLast
    );

    // El reset visual lo hará el cambio de pregunta desde el padre
    setSelected(null);
    setWasCorrect(null);
    setLocked(false);
    setShowNext(false);
  };

  const renderOptionStyle = (optText) => {
    const text = (optText || "").trim();

    if (!locked) {
      // Estado normal
      return {
        container: styles.optionBtn,
        text: styles.optionText,
      };
    }

    // Después de contestar...
    const isSelected = text === selected;
    const isCorrectOpt = text === correctText;

    // Caso: opción seleccionada
    if (isSelected) {
      if (wasCorrect) {
        return {
          container: [styles.optionBtn, styles.optCorrect],
          text: [styles.optionText, styles.optCorrectText],
        };
      } else {
        return {
          container: [styles.optionBtn, styles.optWrong],
          text: [styles.optionText, styles.optWrongText],
        };
      }
    }

    // Caso: opción correcta (cuando fallaste)
    if (!wasCorrect && isCorrectOpt) {
      return {
        container: [styles.optionBtn, styles.optCorrectSoft],
        text: [styles.optionText, styles.optCorrectText],
      };
    }

    // Opción normal
    return {
      container: styles.optionBtn,
      text: styles.optionText,
    };
  };

  return (
    <View style={styles.card}>
      {/* Encabezado mini */}
      <Text style={styles.miniHeader}>
        Pregunta {index + 1} de {total}
      </Text>

      {/* Contexto */}
      {question.context_text ? (
        <View style={styles.contextBox}>
          <Text style={styles.contextTitle}>Texto:</Text>
          <Text style={styles.contextText}>{question.context_text}</Text>
        </View>
      ) : null}

      {/* Pregunta */}
      <Text style={styles.questionText}>{question.question}</Text>

      {/* Opciones */}
      <View style={styles.optionsBox}>
        {options.map((opt, i) => {
          const optText = typeof opt === "string" ? opt : String(opt);
          const optStyles = renderOptionStyle(optText);

          return (
            <TouchableOpacity
              key={i}
              style={optStyles.container}
              onPress={() => handlePress(optText)}
              activeOpacity={0.8}
            >
              <Text style={optStyles.text}>{optText}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Justificación */}
      {locked && question.justification ? (
        <View style={styles.justBox}>
          <Text style={styles.justTitle}>Justificación</Text>
          <Text style={styles.justText}>{question.justification}</Text>
        </View>
      ) : null}

      {/* Botón Siguiente */}
      {showNext && (
        <TouchableOpacity
          style={styles.nextBtn}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextText}>
            {isLast ? "Ver resultados" : "Siguiente"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ==========================================================
// 🎨 Estilos
// ==========================================================
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  miniHeader: {
    fontSize: 13,
    color: "#777",
    marginBottom: 4,
  },
  skillTag: {
    alignSelf: "flex-start",
    fontSize: 12,
    color: "#6a0dad",
    marginBottom: 8,
    backgroundColor: "#f3e5f5",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },

  contextBox: {
    backgroundColor: "#f4f4ff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  contextTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6a0dad",
    marginBottom: 4,
  },
  contextText: {
    fontSize: 14,
    color: "#444",
  },

  questionText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginBottom: 12,
  },

  optionsBox: {
    marginTop: 4,
  },
  optionBtn: {
    backgroundColor: "#fafafa",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  optionText: {
    fontSize: 14,
    color: "#333",
  },

  // Estados correcto / incorrecto
  optCorrect: {
    backgroundColor: "#d6f5dd",
    borderColor: "#4caf50",
  },
  optCorrectSoft: {
    backgroundColor: "#e7f8ec",
    borderColor: "#66bb6a",
  },
  optWrong: {
    backgroundColor: "#ffe0e0",
    borderColor: "#f44336",
  },
  optCorrectText: {
    color: "#1b5e20",
    fontWeight: "700",
  },
  optWrongText: {
    color: "#b71c1c",
    fontWeight: "700",
  },

  justBox: {
    marginTop: 14,
    padding: 10,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
  },
  justTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555",
    marginBottom: 4,
  },
  justText: {
    fontSize: 13,
    color: "#444",
  },

  nextBtn: {
    marginTop: 16,
    backgroundColor: "#6a0dad",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  nextText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  center: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: "#6a0dad",
  },
});
