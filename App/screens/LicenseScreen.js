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
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState(false);

  const handleActivate = async () => {
    const cleanName = fullName.trim();
    const cleanLicense = license.trim();

    // 🔴 Validación: nombre igual a licencia
    if (cleanName && cleanLicense && cleanName === cleanLicense) {
      setNameError(true);
      return Alert.alert(
        "Datos incorrectos",
        "Por favor ingrese su nombre real en el apartado que corresponde."
      );
    }

    setNameError(false);

    if (!cleanName) {
      setNameError(true);
      return Alert.alert("Error", "Ingresa tu nombre completo.");
    }

    if (!cleanLicense) {
      return Alert.alert("Error", "Ingresa un código de licencia.");
    }

    setLoading(true);

    try {
      const res = await checkLicense(cleanLicense, cleanName);

      if (res.ok) {
        Alert.alert("Éxito", "Licencia activada correctamente.");
        navigation.reset({
          index: 0,
          routes: [{ name: "BootScreen" }],
        });
        return;
      }

      Alert.alert(
        "Error",
        {
          LICENSE_NOT_FOUND: "La licencia no existe.",
          LICENSE_INACTIVE: "La licencia está desactivada.",
          LICENSE_EXPIRED: "La licencia ha expirado.",
          MAX_DEVICES_REACHED: "Límite de dispositivos alcanzado.",
          ERROR: "Ocurrió un error inesperado.",
        }[res.reason] || "No se pudo activar la licencia."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#ad0da0ff" />
        <Text style={{ marginTop: 10 }}>Activando licencia...</Text>
      </View>
    );
  }

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

          <TextInput
            placeholder="Ingresa tu nombre completo"
            placeholderTextColor="#777"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              setNameError(false);
            }}
            autoCapitalize="words"
            style={{
              borderWidth: 1,
              borderColor: nameError ? "#ff3b3b" : "#444",
              padding: 12,
              borderRadius: 8,
              marginBottom: 18,
              color: "#fff",
            }}
          />

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

          <Button title="Activar" color="#920dadff" onPress={handleActivate} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
