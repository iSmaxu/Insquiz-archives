// App/screens/MaintenanceScreen.js
// ==========================================================
// INSQUIZ — MaintenanceScreen (FINAL DEFINITIVO FIXED)
// ==========================================================

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ref, onValue, off, get } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { db } from "../firebase/firebaseConfig";

export default function MaintenanceScreen() {
  const navigation = useNavigation();

  // ----------------------------
  // Licencia local
  // ----------------------------
  const [localLicenseKey, setLocalLicenseKey] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("INSQUIZ_LICENSE_KEY").then(setLocalLicenseKey);
  }, []);

  const isDev =
    typeof localLicenseKey === "string" &&
    localLicenseKey.toLowerCase().includes("dev");

  const isTesting =
    typeof localLicenseKey === "string" &&
    localLicenseKey.toLowerCase().includes("testing");



  // ----------------------------
  // UI state
  // ----------------------------
  const [info, setInfo] = useState(null);
  const [finishing, setFinishing] = useState(false);

  const intervalRef = useRef(null);
  const exitingRef = useRef(false);

  // ----------------------------
  // Leer info UI
  // ----------------------------
  useEffect(() => {
    const infoRef = ref(db, "system/info");

    onValue(infoRef, (snap) => {
      if (snap.exists()) setInfo(snap.val());
    });

    return () => off(infoRef);
  }, []);

  // ----------------------------
  // Recheck automático cada 5s
  // ----------------------------
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      checkMaintenance(true);
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, []);

  // ----------------------------
  // Check mantenimiento
  // auto = true  → respeta bypass
  // auto = false → IGNORA bypass (botón)
  // ----------------------------
  async function checkMaintenance(auto = true) {
    if (exitingRef.current) return;

    if (auto) {
      const bypass = await AsyncStorage.getItem(
        "INSQUIZ_MAINTENANCE_BYPASS"
      );
      if (bypass === "true") return;
    }

    try {
      const snap = await get(ref(db, "system/maintencement"));

      const active =
        snap.exists() && snap.val() === true;

      if (!active) {
        exitMaintenanceNormal();
      }
    } catch (e) {
      console.log("Maintenance check error:", e);
    }
  }

  // ----------------------------
  // Salida normal → BootScreen
  // ----------------------------
  function exitMaintenanceNormal() {
    if (exitingRef.current) return;
    exitingRef.current = true;

    clearInterval(intervalRef.current);
    setFinishing(true);

    AsyncStorage.removeItem("INSQUIZ_MAINTENANCE_BYPASS");

    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "BootScreen" }],
      });
    }, 1500);
  }

  // ----------------------------
  // Salida forzada (Dev / Testing)
  // ----------------------------
  async function exitMaintenanceForced() {
    if (exitingRef.current) return;
    exitingRef.current = true;

    await AsyncStorage.setItem(
      "INSQUIZ_MAINTENANCE_BYPASS",
      "true"
    );

    clearInterval(intervalRef.current);
    setFinishing(true);

    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "MainApp" }],
      });
    }, 1500);
  }

  // ----------------------------
  // Loading
  // ----------------------------
  if (!info) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <View style={styles.container}>
      {!finishing ? (
        <>
          <Text style={styles.title}>
            {info.title || "Mantenimiento"}
          </Text>

          <Text style={styles.message}>
            {info.message ||
              "Sistema temporalmente fuera de servicio"}
          </Text>

          {(isDev || isTesting) && (
            <Text style={styles.adminText}>
              Acceso administrativo habilitado
            </Text>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => checkMaintenance(false)}
            >
              <Text style={styles.retryText}>
                Reintentar ahora
              </Text>
            </TouchableOpacity>

            {(isDev || isTesting) && (
              <TouchableOpacity
                style={styles.forceButton}
                onPress={exitMaintenanceForced}
              >
                <Text style={styles.forceText}>
                  Ingresar de manera forzada
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      ) : (
        <Text style={styles.finishText}>
          Mantenimiento finalizado
        </Text>
      )}

      <Text style={styles.footer}>
        InsQUIZ · Sistema protegido
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6a0dad",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 17,
    color: "#f3e8ff",
    textAlign: "center",
    marginBottom: 16,
  },
  adminText: {
    marginBottom: 14,
    fontSize: 15,
    fontWeight: "700",
    color: "#e6d9ff",
  },
  actions: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  retryButton: {
    width: "85%",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    marginBottom: 10,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  forceButton: {
    width: "85%",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
  },
  forceText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
  finishText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
  },
});
