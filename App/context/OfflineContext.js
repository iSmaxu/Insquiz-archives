// App/context/OfflineContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

const OfflineContext = createContext();

export function OfflineProvider({ children }) {
  const [isConnected, setIsConnected] = useState(true);
  const [checking, setChecking] = useState(false);

  const [offlineSince, setOfflineSince] = useState(null);
  const [lostConnectionAt, setLostConnectionAt] = useState(null);

  const [offlineLocked, setOfflineLocked] = useState(false);
  const [offlineLockPending, setOfflineLockPending] = useState(false);

  const [isInQuiz, setIsInQuiz] = useState(false);

  const LIMIT = 15 * 60 * 1000; // 15 minutos
  const QUIZ_EXTRA = 1 * 60 * 1000; // 1 minuto oculto

  // ------------------------------
  // Verificar internet REAL
  // ------------------------------
  async function checkRealInternet() {
    try {
      setChecking(true);

      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 2500);

      const res = await fetch("https://www.google.com/generate_204", {
        signal: ctrl.signal,
      });

      clearTimeout(timeout);
      return res.status === 204;
    } catch {
      return false;
    } finally {
      setChecking(false);
    }
  }

  // ------------------------------
  // DETECTAR CAMBIO DE RED
  // ------------------------------
  useEffect(() => {
    const unsub = NetInfo.addEventListener(async (state) => {
      const basic = !!state.isConnected;

      if (!basic) {
        // Primera vez sin conexión
        if (isConnected) setLostConnectionAt(Date.now());
        setIsConnected(false);
        setOfflineSince((prev) => prev || Date.now());
        return;
      }

      const real = await checkRealInternet();
      if (!real) {
        if (isConnected) setLostConnectionAt(Date.now());
        setIsConnected(false);
        setOfflineSince((prev) => prev || Date.now());
      } else {
        // Volvió internet
        setIsConnected(true);
        setOfflineSince(null);
        setOfflineLocked(false);
        setOfflineLockPending(false);
        setLostConnectionAt(null);
      }
    });

    return () => unsub();
  }, [isConnected]);

  // ------------------------------
  // CRONÓMETRO DE 10 MINUTOS
  // ------------------------------
  useEffect(() => {
    if (!offlineSince) return;

    const interval = setInterval(async () => {
      const real = await checkRealInternet();
      if (real) {
        // Recuperó conexión
        setIsConnected(true);
        setOfflineSince(null);
        return;
      }

      const elapsed = Date.now() - offlineSince;

      if (elapsed >= LIMIT) {
        if (isInQuiz) {
          // Marcar que al salir del quiz debe expulsarse
          setOfflineLockPending(true);
        } else {
          // Expulsión inmediata
          setOfflineLocked(true);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [offlineSince, isInQuiz]);

  // ------------------------------
  // APLICAR 1 MINUTO EXTRA DESPUÉS DEL QUIZ
  // ------------------------------
  useEffect(() => {
    if (!isInQuiz && offlineLockPending) {
      const timeout = setTimeout(() => {
        setOfflineLocked(true);
        setOfflineLockPending(false);
      }, QUIZ_EXTRA);

      return () => clearTimeout(timeout);
    }
  }, [isInQuiz, offlineLockPending]);

  return (
    <OfflineContext.Provider
      value={{
        isConnected,
        checking,
        lostConnectionAt,
        offlineLocked,
        offlineSince,
        isInQuiz,
        setQuizActive: setIsInQuiz,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  return useContext(OfflineContext);
}
