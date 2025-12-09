// App/components/AchievementToast.js
import React, { useEffect, useRef } from "react";
import { Animated, View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function AchievementToast({ title, visible }) {
  const y = useRef(new Animated.Value(-120)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(y, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(y, {
          toValue: -120,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY: y }] }]}>
      <MaterialCommunityIcons name="trophy" size={22} color="#ffd700" />
      <Text style={styles.text}>¡Logro desbloqueado! {title}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    zIndex: 999,
    backgroundColor: "#6a0dad",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
  },
  text: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "700",
  },
});
