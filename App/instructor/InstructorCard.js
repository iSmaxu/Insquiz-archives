import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";

import { useInstructor } from "./InstructorProvider";
import InstructorProgress from "./InstructorProgress";
import { INSTRUCTOR_ENABLED } from "./instructor.config";

export default function InstructorCard() {
  // 🔌 APAGADO TOTAL
  if (!INSTRUCTOR_ENABLED) return null;

  const { state } = useInstructor();
  const [expanded, setExpanded] = useState(false);

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (!state || state.currentStep > 4) return null;

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          { opacity, transform: [{ translateY }] },
        ]}
      >
        <Text style={styles.step}>
          Paso {state.currentStep} de 4
        </Text>

        <Text style={styles.text}>
          {getMessage(state.currentStep)}
        </Text>

        {expanded && (
          <InstructorProgress currentStep={state.currentStep} />
        )}

        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.link}>
            {expanded ? "Ocultar progreso" : "Ver progreso"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

function getMessage(step) {
  return [
    "Empieza practicando sin presión.",
    "Las justificaciones enseñan más que el puntaje.",
    "InsQUIZ tiene más herramientas de las que se ven.",
    "Cuando quieras, explora el modo avanzado.",
  ][step - 1];
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  card: {
    backgroundColor: "#141320",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#272739",
  },
  step: {
    fontSize: 12,
    color: "#a2a4c1",
    marginBottom: 6,
  },
  text: {
    fontSize: 15,
    color: "#f5f5ff",
    marginBottom: 10,
  },
  link: {
    fontSize: 13,
    color: "#4cc9f0",
    marginTop: 6,
  },
});
