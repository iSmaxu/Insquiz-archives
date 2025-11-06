// App/components/LicenseGate.js
import React, { useEffect, useState, useRef } from "react";
import { View, ActivityIndicator, Alert, AppState } from "react-native";
import LicenseScreen from "../screens/LicenseScreen";
import {
  getLicenseToken,
  validateLicenseOnlineDetailed,
  clearLicense,
  attachPushInvalidateListener,
} from "../services/licenseService";

export default function LicenseGate({ children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [lastValidTime, setLastValidTime] = useState(null);
  const intervalRef = useRef(null);
  const listenerRef = useRef(null);
  const appState = useRef(AppState.currentState);

  const OFFLINE_TOLERANCE_MS = 45 * 60 * 1000; // 45 minutos

  // 🔹 Inicialización
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const saved = await getLicenseToken();
        if (!saved) {
          if (mounted) {
            setAuthorized(false);
            setLoading(false);
          }
          return;
        }

        const res = await validateLicenseOnlineDetailed();
        if (res.valid) {
          if (mounted) {
            setAuthorized(true);
            setLastValidTime(Date.now());
          }
        } else {
          if (res.reason === "error") {
            const now = Date.now();
            if (mounted) {
              setAuthorized(true);
              setLastValidTime(now);
            }
          } else {
            if (mounted) setAuthorized(false);
          }
        }
      } catch (e) {
        console.log("init license check error", e);
        if (mounted) setAuthorized(false);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    init();
    return () => (mounted = false);
  }, []);

  // 🔹 Listener pushInvalidate
  useEffect(() => {
    let active = true;
    const attach = async () => {
      const token = await getLicenseToken();
      if (!token) return;
      listenerRef.current = attachPushInvalidateListener(token, async () => {
        if (!active) return;
        await clearLicense();
        Alert.alert(
          "Licencia desactivada",
          "Tu licencia fue desactivada por el administrador."
        );
        setAuthorized(false);
      });
    };
    attach();

    return () => {
      active = false;
      if (listenerRef.current && typeof listenerRef.current === "function") {
        listenerRef.current();
      }
    };
  }, []);

  // 🔹 Validación periódica cada 15 s (solo si hay licencia activa)
  useEffect(() => {
    const startValidation = async () => {
      if (!authorized) return;
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(async () => {
        const currentToken = await getLicenseToken();
        if (!currentToken) {
          // 🧠 Licencia eliminada → detener validación
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setAuthorized(false);
          return;
        }

        try {
          const res = await validateLicenseOnlineDetailed();
          if (res.valid) {
            setLastValidTime(Date.now());
          } else if (res.reason === "error") {
            const elapsed = lastValidTime ? Date.now() - lastValidTime : Infinity;
            if (elapsed <= OFFLINE_TOLERANCE_MS) return; // tolerancia offline
          } else {
            await clearLicense();
            Alert.alert("Licencia inválida", "Tu licencia ha sido revocada o caducó.");
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setAuthorized(false);
          }
        } catch (e) {
          console.warn("periodic validation error", e);
        }
      }, 15000);
    };

    startValidation();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [authorized, lastValidTime]);

  // 🔹 Verificación al reanudar la app
  useEffect(() => {
    const sub = AppState.addEventListener("change", async (next) => {
      if (appState.current.match(/inactive|background/) && next === "active") {
        const currentToken = await getLicenseToken();
        if (!currentToken) {
          setAuthorized(false);
          return;
        }
        try {
          const res = await validateLicenseOnlineDetailed();
          if (res.valid) {
            setAuthorized(true);
            setLastValidTime(Date.now());
          } else {
            await clearLicense();
            setAuthorized(false);
          }
        } catch (e) {
          console.warn("resume validation failed", e);
        }
      }
      appState.current = next;
    });
    return () => sub.remove();
  }, []);

  // 🔹 Renderizado
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#000",
        }}
      >
        <ActivityIndicator size="large" color="#b91c1c" />
      </View>
    );
  }

  if (!authorized) {
    return (
      <LicenseScreen
        onSuccess={() => {
          setAuthorized(true);
          setLastValidTime(Date.now());
        }}
      />
    );
  }

  return children;
}
