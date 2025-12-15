// App/context/LicenseContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { validateLicense } from "../services/LicenseService";
import { registerUserForNotifications } from "../services/RegisterUserService";

export const LicenseContext = createContext();

export function LicenseProvider({ children }) {
  const [licenseKey, setLicenseKey] = useState(null);
  const [licenseStatus, setLicenseStatus] = useState("checking");

  // ==========================================================
  // ✨ ACTIVA LICENCIA — recibe key + nickname
  // ==========================================================
  async function checkLicense(key, nickname) {
    try {
      const trimmedKey = key.trim();
      const trimmedNick = nickname.trim();

      if (!trimmedKey || !trimmedNick) {
        return { ok: false, reason: "MISSING_DATA" };
      }

      const res = await validateLicense(trimmedKey);

      if (res.ok) {
        await AsyncStorage.setItem("INSQUIZ_LICENSE_KEY", trimmedKey);

        setLicenseKey(trimmedKey);
        setLicenseStatus("active");

        // Registrar usuario en /users
        await registerUserForNotifications(trimmedKey, trimmedNick);

        return { ok: true, reason: res.reason };
      }

      if (res.reason === "DEVICE_BLOCKED") {
        setLicenseStatus("device_blocked");
        return { ok: false, reason: "DEVICE_BLOCKED" };
      }

      setLicenseStatus("invalid");
      return { ok: false, reason: res.reason };

    } catch (error) {
      console.log("❌ Error en checkLicense:", error);
      return { ok: false, reason: "ERROR" };
    }
  }

  // ==========================================================
  // CARGAR LICENCIA DESDE STORAGE
  // ==========================================================
  async function loadLicenseFromStorage() {
    const savedKey = await AsyncStorage.getItem("INSQUIZ_LICENSE_KEY");

    if (!savedKey) {
      setLicenseStatus("invalid");
      return;
    }

    const res = await validateLicense(savedKey);

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
  // LOGOUT
  // ==========================================================
  async function logout() {
    await AsyncStorage.removeItem("INSQUIZ_LICENSE_KEY");
    setLicenseKey(null);
    setLicenseStatus("invalid");
  }

  // ==========================================================
  // 🔁 Revalidación automática cada 5 segundos
  // ==========================================================
  useEffect(() => {
    if (!licenseKey) return;

    const interval = setInterval(async () => {
      if (licenseStatus !== "active") return;

      const res = await validateLicense(licenseKey);

      if (!res.ok) {
        if (res.reason === "DEVICE_BLOCKED") {
          setLicenseStatus("device_blocked");
        } else {
          setLicenseStatus("invalid");
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [licenseKey, licenseStatus]);

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

export function useLicense() {
  return useContext(LicenseContext);
}
