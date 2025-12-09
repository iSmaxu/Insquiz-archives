// App/components/BuildInfo.js
// ==============================================
// Muestra información técnica de la build:
// commit, canal, id de update OTA
// ==============================================

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Constants from "expo-constants";
import * as Updates from "expo-updates";

export default function BuildInfo() {
  const commit = Constants.expoConfig?.extra?.commit ?? "unknown";
  const runtimeVersion = Constants.expoConfig?.runtimeVersion ?? "n/a";

  const channel = Updates.channel ?? "local/dev";
  const updateId = Updates.updateId
    ? Updates.updateId.toString().slice(0, 8)
    : "no-ota";
  const date = Updates.createdAt
    ? new Date(Updates.createdAt).toLocaleString()
    : null;

  return (
    <View style={styles.container}>
      <Text style={styles.line}>Commit: {commit}</Text>
      <Text style={styles.line}>Canal: {channel}</Text>
      <Text style={styles.line}>Runtime: {runtimeVersion}</Text>
      <Text style={styles.line}>Update ID: {updateId}</Text>
      {date && <Text style={styles.line}>OTA: {date}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
  },
  line: {
    fontSize: 11,
    color: "#777",
  },
});
