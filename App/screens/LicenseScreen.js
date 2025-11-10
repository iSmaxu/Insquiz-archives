import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { activateLicenseLocal } from "../services/licenseService";

export default function LicenseScreen() {
  const [license, setLicense] = useState("");
  const [loading, setLoading] = useState(false);

  const handleActivate = async () => {
    if (!license.trim()) return Alert.alert("Error", "Ingresa un código de licencia.");

    setLoading(true);
    try {
      const result = await activateLicenseLocal(license.trim());
      if (result.ok) {
        Alert.alert("Éxito", "Licencia activada correctamente. Reinicia la app.");
      } else {
        Alert.alert("Error", result.error || "No se pudo activar la licencia.");
      }
    } catch (err) {
      Alert.alert("Error", "Ocurrió un problema durante la activación.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6a0dad" />
        <Text style={{ marginTop: 10 }}>Activando licencia...</Text>
      </View>
    );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#000" }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ padding: 24, justifyContent: "center", flex: 1 }}>
          <Text style={{ fontSize: 22, fontWeight: "700", color: "#fff", marginBottom: 12, textAlign: "center" }}>
            Activar licencia
          </Text>

          <TextInput
            placeholder="Código de licencia"
            placeholderTextColor="#777"
            value={license}
            onChangeText={setLicense}
            autoCapitalize="none"
            style={{
              borderWidth: 1,
              borderColor: "#444",
              padding: 12,
              borderRadius: 8,
              marginBottom: 12,
              color: "#fff",
            }}
          />

          <Button title="Activar" color="#6a0dad" onPress={handleActivate} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
