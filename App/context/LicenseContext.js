// App/context/LicenseContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { validateLicense } from "../services/LicenseService";

export const LicenseContext = createContext();

export function LicenseProvider({ children }) {
  const [licenseKey, setLicenseKey] = useState(null);
  const [licenseStatus, setLicenseStatus] = useState("checking");
  // checking | active | invalid | device_blocked

  // ==========================================================
  // ✨ Activar licencia desde LicenseScreen
  // Ahora recibe: key + nickname
  // ==========================================================
  async function checkLicense(key, nickname) {
    console.log("🔍 checkLicense:", key, "nickname:", nickname);

    // validateLicense ahora maneja también nickname
    const res = await validateLicense(key, nickname);
    console.log("🔍 validateLicense devolvió:", res);

    if (res.ok) {
      await AsyncStorage.setItem("INSQUIZ_LICENSE_KEY", key);
      setLicenseKey(key);
      setLicenseStatus("active");
      return { ok: true, reason: res.reason };
    }

    if (res.reason === "DEVICE_BLOCKED") {
      setLicenseStatus("device_blocked");
      return { ok: false, reason: "DEVICE_BLOCKED" };
    }

    setLicenseStatus("invalid");
    return { ok: false, reason: res.reason };
  }

  // ==========================================================
  // Cargar licencia desde almacenamiento
  // ==========================================================
  async function loadLicenseFromStorage() {
    console.log("🔍 loadLicenseFromStorage() ejecutado");

    const savedKey = await AsyncStorage.getItem("INSQUIZ_LICENSE_KEY");
    console.log("→ Clave encontrada en storage:", savedKey);

    if (!savedKey) {
      setLicenseStatus("invalid");
      return;
    }

    const res = await validateLicense(savedKey);
    console.log("→ validateLicense devolvió:", res);

    if (res.ok) {
      setLicenseKey(savedKey);
      setLicenseStatus("active");
    } else if (res.reason === "DEVICE_BLOCKED") {
      setLicenseStatus("device_blocked");
    } else {
      setLicenseStatus("invalid");
    }
  }

  // ==========================================================
  // Cerrar sesión
  // ==========================================================
  async function logout() {
    await AsyncStorage.removeItem("INSQUIZ_LICENSE_KEY");
    setLicenseKey(null);
    setLicenseStatus("invalid");
  }

  // ==========================================================
  // 🔁 Revalidación automática cada 5s
  // ==========================================================
  useEffect(() => {
    if (!licenseKey) return;

    console.log("⏱ Revalidación automática iniciada…");

    const interval = setInterval(async () => {
      if (licenseStatus !== "active") return;

      const res = await validateLicense(licenseKey);

      if (!res.ok) {
        console.log("❌ Licencia dejó de ser válida:", res.reason);

        if (res.reason === "DEVICE_BLOCKED") {
          setLicenseStatus("device_blocked");
        } else {
          setLicenseStatus("invalid");
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [licenseKey]);

  return (
    <LicenseContext.Provider
      value={{
        licenseKey,
        licenseStatus,
        checkLicense,
        loadLicenseFromStorage,
        logout,
      }}
    >
      {children}
    </LicenseContext.Provider>
  );
}

// ==========================================================
// Hook para consumir el contexto
// ==========================================================
export function useLicense() {
  return useContext(LicenseContext);
}
