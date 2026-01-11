// App/components/OfflineRecoveryBanner.js
import React, { useEffect, useRef, useState } from "react";
import { Text, Animated, StyleSheet } from "react-native";
import { useOffline } from "../context/OfflineContext";

export default function OfflineRecoveryBanner() {
  const { connectionRecoveredAt } = useOffline();

  const [visible, setVisible] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!connectionRecoveredAt) return;

    setVisible(true);

    Animated.timing(fade, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }, 4000);

    return () => clearTimeout(timeout);
  }, [connectionRecoveredAt]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.banner, { opacity: fade }]}>
      <Text style={styles.text}>Conexión restablecida ✓</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 45,
    left: 0,
    right: 0,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#2a9d8f",
    zIndex: 9999,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
});
