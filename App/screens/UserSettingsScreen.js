// App/screens/UserSettingsScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator, Alert } from "react-native";
import { getDatabase, ref, get, child } from "firebase/database";
import { getLicenseToken, clearLicense } from "../services/licenseService";
import { initializeApp } from "firebase/app";
import { useNavigation } from "@react-navigation/native";

// ⚙️ Config Firebase (misma config que licenseService)
const firebaseConfig = {
  apiKey: "AIzaSyCGFQPk4idrDgFpl1f0ixKF7D63vLYjZGA",
  authDomain: "insquiz-admin.firebaseapp.com",
  databaseURL: "https://insquiz-admin-default-rtdb.firebaseio.com",
  projectId: "insquiz-admin",
  storageBucket: "insquiz-admin.firebasestorage.app",
  messagingSenderId: "236979447253",
  appId: "1:236979447253:web:08c9075dbfa1183fa9095c"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function UserSettingsScreen() {
  const [licenseKey, setLicenseKey] = useState("");
  const [clientName, setClientName] = useState("");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const load = async () => {
      try {
        const key = await getLicenseToken();
        if (!key) {
          setLoading(false);
          return;
        }
        setLicenseKey(key);

        const snap = await get(child(ref(db), `licenses/${key}`));
        if (snap.exists()) {
          const data = snap.val();
          setClientName(data.clientName || "Desconocido");
        }
      } catch (err) {
        console.error("Error cargando licencia:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const maskKey = (key) => {
    if (!key) return "";
    const half = Math.floor(key.length / 2);
    return key.substring(0, half) + "*****";
  };

  const handleLogout = async () => {
    await clearLicense();
    Alert.alert("Sesión cerrada", "Tu licencia fue eliminada del dispositivo.");
    navigation.reset({
      index: 0,
      routes: [{ name: "License" }],
    });
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ActivityIndicator size="large" color="#6a0dad" />
        <Text style={{ marginTop: 10 }}>Cargando información...</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        backgroundColor: "#fff",
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 20 }}>
        Configuración de usuario
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 10 }}>
        <Text style={{ fontWeight: "bold" }}>Nombre de la licencia:</Text>{" "}
        {clientName || "—"}
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 30 }}>
        <Text style={{ fontWeight: "bold" }}>Clave actual:</Text>{" "}
        {maskKey(licenseKey)}
      </Text>

      <Button title="Cerrar sesión" color="#b40000" onPress={handleLogout} />
    </View>
  );
}
