// App/context/LicenseContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { validateLicense } from "../services/LicenseService";
import { registerUserForNotifications } from "../services/RegisterUserService";

export const LicenseContext = createContext();

export function LicenseProvider({ children }) {
  const [licenseKey, setLicenseKey] = useState(null);
  const [licenseStatus, setLicenseStatus] = useState("checking");
  const [fullName, setFullName] = useState(null);
  const [maintenanceBypass, setMaintenanceBypass] = useState(false);

  // ==========================================================
  // ACTIVAR LICENCIA
  // ==========================================================
  async function checkLicense(key, name) {
    try {
      const trimmedKey = key.trim();
      const trimmedName = name.trim();

      if (!trimmedKey || !trimmedName) {
        return { ok: false, reason: "MISSING_DATA" };
      }

      const res = await validateLicense(trimmedKey, trimmedName);

      if (res.ok) {
        await AsyncStorage.setItem("INSQUIZ_LICENSE_KEY", trimmedKey);
        await AsyncStorage.setItem("INSQUIZ_FULL_NAME", trimmedName);

        setLicenseKey(trimmedKey);
        setFullName(trimmedName);
        setLicenseStatus("active");

        await registerUserForNotifications(trimmedKey, trimmedName);

        return { ok: true, reason: res.reason };
      }

      setLicenseStatus("invalid");
      return { ok: false, reason: res.reason };
    } catch (error) {
      console.log("❌ Error en checkLicense:", error);
      return { ok: false, reason: "ERROR" };
    }
  }

  // ==========================================================
  // CARGAR DESDE STORAGE
  // ==========================================================
  async function loadLicenseFromStorage() {
    const savedKey = await AsyncStorage.getItem("INSQUIZ_LICENSE_KEY");
    const savedName = await AsyncStorage.getItem("INSQUIZ_FULL_NAME");
    const bypass = await AsyncStorage.getItem(
      "INSQUIZ_MAINTENANCE_BYPASS"
    );

    setMaintenanceBypass(bypass === "true");

    if (!savedKey) {
      setLicenseStatus("invalid");
      return;
    }

    setFullName(savedName || null);

    const res = await validateLicense(savedKey, savedName);

    if (res.ok) {
      setLicenseKey(savedKey);
      setLicenseStatus("active");
    } else {
      setLicenseStatus("invalid");
    }
  }

  // ==========================================================
  // LOGOUT
  // ==========================================================
  async function logout() {
    await AsyncStorage.multiRemove([
      "INSQUIZ_LICENSE_KEY",
      "INSQUIZ_FULL_NAME",
      "INSQUIZ_MAINTENANCE_BYPASS",
    ]);
    setLicenseKey(null);
    setFullName(null);
    setLicenseStatus("invalid");
    setMaintenanceBypass(false);
  }

  // ==========================================================
  // REVALIDACIÓN AUTOMÁTICA (DESACTIVADA SI BYPASS)
  // ==========================================================
  useEffect(() => {
    if (!licenseKey) return;
    if (maintenanceBypass) return;

    const interval = setInterval(async () => {
      if (licenseStatus !== "active") return;

      const res = await validateLicense(licenseKey, fullName);

      if (!res.ok) {
        setLicenseStatus("invalid");
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [licenseKey, licenseStatus, fullName, maintenanceBypass]);

  return (
    <LicenseContext.Provider
      value={{
        licenseKey,
        licenseStatus,
        fullName,
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
