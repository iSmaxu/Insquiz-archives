import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { getQuestionById } from "../services/quizService";
import QuestionCard from "../components/QuestionCard";

export default function TestQuestionScreen() {
  const [id, setId] = useState("");
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // ===============================
  // Util: calcular siguiente ID
  // ===============================
  const getNextId = (currentId) => {
    const match = currentId.match(/^([A-Z]+)-(\d+)$/);
    if (!match) return null;

    const prefix = match[1];
    const numStr = match[2];
    const nextNum = parseInt(numStr, 10) + 1;

    return `${prefix}-${nextNum.toString().padStart(numStr.length, "0")}`;
  };

  // ===============================
  // Cargar por ID
  // ===============================
  const loadById = async (customId) => {
    setLoading(true);
    setError(null);
    setQuestion(null);

    try {
      const q = await getQuestionById(customId);

      if (!q) {
        setError(`Pregunta no encontrada: ${customId}`);
        return;
      }

      setId(customId);
      setQuestion(q);
    } finally {
      setLoading(false);
    }
  };

  const load = async () => {
    if (!id.trim()) {
      setError("Ingresa un ID válido");
      setQuestion(null);
      return;
    }

    await loadById(id.trim());
  };

  const loadNext = async () => {
    if (!id) return;

    const nextId = getNextId(id);
    if (!nextId) {
      setError("No se pudo calcular el siguiente ID");
      return;
    }

    await loadById(nextId);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Buscar pregunta</Text>
        <Text style={styles.subtitle}>
          Carga una pregunta por su ID exacto
        </Text>
      </View>

      {/* INPUT */}
      <View style={styles.inputBox}>
        <TextInput
          placeholder="Ej: EN-0007"
          placeholderTextColor="#7f82b8"
          value={id}
          onChangeText={setId}
          style={styles.input}
          autoCapitalize="characters"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={load}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Buscando…" : "Cargar pregunta"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ERROR */}
      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* RESULT */}
      {question && (
        <View style={styles.cardWrapper}>
          <QuestionCard
            question={question}
            index={0}
            total={1}
            onNext={({ letter }) => {
              console.log("Respuesta enviada:", letter);
            }}
          />

          {/* BOTÓN SIGUIENTE */}
          <TouchableOpacity
            style={[
              styles.nextButton,
              loading && styles.buttonDisabled,
            ]}
            onPress={loadNext}
            disabled={loading}
          >
            <Text style={styles.nextButtonText}>
              {loading ? "Cargando…" : "Siguiente"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f1220",
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 60,
    flexGrow: 1,
  },

  header: {
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
  },

  subtitle: {
    fontSize: 14,
    color: "#b5b7ff",
    marginTop: 4,
  },

  inputBox: {
    backgroundColor: "#1a1d36",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#262a4f",
  },

  input: {
    backgroundColor: "#0f1220",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#2c2f55",
  },

  button: {
    backgroundColor: "#6c63ff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  nextButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 15,
  },

  nextButtonText: {
    color: "#052e16",
    fontWeight: "900",
    fontSize: 15,
  },

  errorBox: {
    backgroundColor: "#2a0f18",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ff4d6d",
  },

  errorText: {
    color: "#ff9aa9",
    fontSize: 14,
    fontWeight: "600",
  },

  cardWrapper: {
    marginTop: 16,
  },
});
