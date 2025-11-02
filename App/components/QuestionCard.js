// App/components/QuestionCard.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";

// Habilitar animaciones en Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function QuestionCard({ question, index, total, onNext, bankStatus }) {
  const [selected, setSelected] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const isLocal = bankStatus === "local";

  const handleSelect = (option) => {
    if (selected) return; // evita doble clic
    setSelected(option);

    if (!isLocal) {
      setIsCorrect(option === question.correcta);
    }
  };

  const toggleInfo = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowInfo(!showInfo);
  };

  const handleLocalNext = () => {
    setSelected(null);
    onNext?.();
  };

  return (
    <View style={styles.card}>
      <Text style={styles.progress}>
        Pregunta {index + 1} de {total}
      </Text>

      <Text style={styles.question}>
        {question.pregunta || question.question || "Sin texto disponible"}
      </Text>

      {Array.isArray(question.opciones || question.options) &&
        (question.opciones || question.options).map((opt, i) => {
          const isSelected = selected === opt;
          const correct = opt === (question.correcta || question.answer);

          let bg = "#f7f7f7";
          if (selected) {
            if (isLocal) {
              bg = isSelected ? "#e0d7f8" : "#f7f7f7";
            } else {
              bg =
                isSelected && isCorrect
                  ? "#c8f7c5"
                  : isSelected && !isCorrect
                  ? "#f8d7da"
                  : "#f7f7f7";
            }
          }

          return (
            <TouchableOpacity
              key={i}
              style={[styles.option, { backgroundColor: bg }]}
              onPress={() => handleSelect(opt)}
            >
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          );
        })}

      {/* Modo LOCAL (banco viejo) */}
      {isLocal && selected && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#6a0dad" }]}
            onPress={handleLocalNext}
          >
            <Text style={styles.buttonText}>Siguiente pregunta</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modo ONLINE (banco nuevo con animación y justificación) */}
      {!isLocal && selected && (
        <View style={styles.footer}>
          {!showInfo ? (
            <>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#6a0dad" }]}
                onPress={toggleInfo}
              >
                <Text style={styles.buttonText}>Ver más información</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#444" }]}
                onPress={onNext}
              >
                <Text style={styles.buttonText}>Siguiente pregunta</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>
                {isCorrect ? "✅ ¡Respuesta correcta!" : "❌ Respuesta incorrecta"}
              </Text>
              <Text style={styles.justificacion}>
                {question.justificacion || "No hay justificación disponible."}
              </Text>
              <Text style={styles.skill}>
                🧠 Habilidad desarrollada:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {question.skill || "Sin registro"}
                </Text>
              </Text>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#6a0dad" }]}
                onPress={onNext}
              >
                <Text style={styles.buttonText}>Siguiente pregunta</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  progress: {
    color: "#6a0dad",
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  option: {
    backgroundColor: "#f7f7f7",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 5,
    minWidth: 200,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  infoBox: {
    marginTop: 20,
    backgroundColor: "#f9f9ff",
    padding: 16,
    borderRadius: 12,
    borderColor: "#e0e0ff",
    borderWidth: 1,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#6a0dad",
    textAlign: "center",
  },
  justificacion: {
    fontSize: 15,
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  skill: {
    fontSize: 14,
    color: "#444",
    marginBottom: 10,
    textAlign: "center",
  },
});
