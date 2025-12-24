import React from "react";
import { View, Text } from "react-native";
import { SvgXml } from "react-native-svg";

export default function StimulusRenderer({ visual }) {
  if (!visual) return null;

  if (visual.type === "svg") {
    // SVG real disponible
    if (visual.svg && typeof visual.svg === "string") {
      return (
        <View style={{ marginBottom: 16 }}>
          <SvgXml
            xml={visual.svg}
            width="100%"
            height={320}
          />
        </View>
      );
    }

    // Placeholder cuando aún no hay SVG
    return (
      <View
        style={{
          height: 180,
          marginBottom: 16,
          borderRadius: 8,
          backgroundColor: "#1a1a2e",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text style={{ color: "#b8b8e6", fontSize: 13 }}>
          Espacio reservado para material gráfico
        </Text>
      </View>
    );
  }

  return null;
}
