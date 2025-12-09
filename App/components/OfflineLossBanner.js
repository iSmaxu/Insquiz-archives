// App/components/OfflineLossBanner.js
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { useOffline } from "../context/OfflineContext";

export default function OfflineLossBanner() {
  const { lostConnectionAt, offlineSince } = useOffline();

  const [visible, setVisible] = useState(false);
  const [now, setNow] = useState(Date.now());
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!lostConnectionAt || !offlineSince) return;

    setVisible(true);
    setNow(Date.now());

    Animated.timing(fade, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      Animated.timing(fade, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    }, 5000);

    return () => clearTimeout(timeout);
  }, [lostConnectionAt, offlineSince]);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [visible]);

  if (!visible || !offlineSince) return null;

  const elapsed = Math.floor((now - offlineSince) / 1000);
  const remaining = Math.max(0, 600 - elapsed);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <Animated.View style={[styles.banner, { opacity: fade }]}>
      <Text style={styles.text}>
        Sin conexión — {mm}:{ss} minutos antes de forzar salida
      </Text>
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
    backgroundColor: "#d62828",
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
});
