// App/screens/LicenseScreen.js
import React, { useState, useContext } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { LicenseContext } from "../context/LicenseContext";

export default function LicenseScreen() {
  const navigation = useNavigation();
  const { checkLicense } = useContext(LicenseContext);

  const [license, setLicense] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);

  const handleActivate = async () => {
    if (!license.trim())
      return Alert.alert("Error", "Ingresa un código de licencia.");

    if (!nickname.trim())
      return Alert.alert("Error", "Ingresa un nickname.");

    setLoading(true);
    try {
      // → Se envía: código y nickname
      const result = await checkLicense(license.trim(), nickname.trim());

      if (result.ok) {
        Alert.alert("Éxito", "Licencia activada correctamente.");

        // Reiniciar navegación hacia BootScreen
        navigation.reset({
          index: 0,
          routes: [{ name: "Boot" }],
        });

        return;
      }

      Alert.alert(
        "Error",
        {
          LICENSE_NOT_FOUND: "❌ La licencia no existe.",
          LICENSE_INACTIVE: "⚠️ La licencia está desactivada.",
          LICENSE_EXPIRED: "⏳ La licencia ha expirado.",
          MAX_DEVICES_REACHED: "🚫 Límite de dispositivos alcanzado.",
          ERROR: "⚠️ Error inesperado.",
        }[result.reason] || "No se pudo activar la licencia."
      );
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
          <Text
            style={{
              fontSize: 22,
              fontWeight: "700",
              color: "#fff",
              marginBottom: 12,
              textAlign: "center",
            }}
          >
            Activar licencia
          </Text>
          {/* Input nickname */}
          <TextInput
            placeholder="Ingresa tu nombre"
            placeholderTextColor="#777"
            value={nickname}
            onChangeText={setNickname}
            autoCapitalize="none"
            style={{
              borderWidth: 1,
              borderColor: "#444",
              padding: 12,
              borderRadius: 8,
              marginBottom: 18,
              color: "#fff",
            }}
          />
          {/* Input licencia */}
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
