import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLicenseToken, validateLicenseOnlineDetailed } from "../services/licenseService";
import LicenseScreen from "../screens/LicenseScreen";
import DrawerRoot from "../navigation/DrawerRoot";

export default function LicenseGate() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [token, setToken] = useState(null);

  const validate = async () => {
    try {
      const localKey = await getLicenseToken();
      setToken(localKey);
      if (!localKey) {
        setAuthorized(false);
        return;
      }

      const result = await validateLicenseOnlineDetailed(localKey);
      setAuthorized(result.valid);
    } catch (err) {
      console.warn("Error validando licencia:", err);
      setAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    validate();
  }, []);

  useEffect(() => {
    const interval = setInterval(validate, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") validate();
    });
    return () => subscription.remove();
  }, []);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6a0dad" />
        <Text style={styles.text}>Verificando licencia...</Text>
      </View>
    );

  return authorized ? <DrawerRoot /> : <LicenseScreen />;
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { color: "#6a0dad", marginTop: 10, fontWeight: "600" },
});
