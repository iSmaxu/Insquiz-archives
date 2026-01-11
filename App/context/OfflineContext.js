// App/context/OfflineContext.js

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import NetInfo from "@react-native-community/netinfo";

const OfflineContext = createContext();

export function OfflineProvider({ children }) {
  // ------------------------------
  // ESTADOS PRINCIPALES
  // ------------------------------
  const [isConnected, setIsConnected] = useState(true);
  const [checking, setChecking] = useState(false);

  const [offlineSince, setOfflineSince] = useState(null);
  const [lostConnectionAt, setLostConnectionAt] = useState(null);
  const [connectionRecoveredAt, setConnectionRecoveredAt] = useState(null);

  const [offlineLocked, setOfflineLocked] = useState(false);
  const [offlineLockPending, setOfflineLockPending] = useState(false);

  const [isInQuiz, setIsInQuiz] = useState(false);

  // ------------------------------
  // CONSTANTES DE POLÍTICA
  // ------------------------------
  const LIMIT = 15 * 60 * 1000;     // 15 minutos offline reales
  const QUIZ_EXTRA = 1 * 60 * 1000; // 1 minuto extra post-quiz
  const CHECK_TIMEOUT = 2500;      // timeout red real
  const CHECK_INTERVAL = 5000;     // verificación periódica

  // ------------------------------
  // VERIFICAR INTERNET REAL
  // ------------------------------
  async function checkRealInternet() {
    try {
      setChecking(true);

      const controller = new AbortController();
      const timeout = setTimeout(
        () => controller.abort(),
        CHECK_TIMEOUT
      );

      const res = await fetch(
        "https://www.google.com/generate_204",
        { signal: controller.signal }
      );

      clearTimeout(timeout);
      return res.status === 204;
    } catch {
      return false;
    } finally {
      setChecking(false);
    }
  }

  // ------------------------------
  // DETECTOR DE CAMBIOS DE RED
  // ------------------------------
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      const hasNetworkInterface = !!state.isConnected;

      // 🔴 Red ausente (no interfaz)
      if (!hasNetworkInterface) {
        if (isConnected) setLostConnectionAt(Date.now());
        setIsConnected(false);
        setOfflineSince((prev) => prev || Date.now());
        return;
      }

      // 🟡 Hay red, pero verificamos internet real
      const realInternet = await checkRealInternet();

      if (!realInternet) {
        if (isConnected) setLostConnectionAt(Date.now());
        setIsConnected(false);
        setOfflineSince((prev) => prev || Date.now());
        return;
      }

      // 🟢 Conexión recuperada
      if (!isConnected) {
        setConnectionRecoveredAt(Date.now());
      }

      setIsConnected(true);
      setOfflineSince(null);
      setOfflineLocked(false);
      setOfflineLockPending(false);
      setLostConnectionAt(null);
    });

    return () => unsubscribe();
  }, [isConnected]);

  // ------------------------------
  // CRONÓMETRO OFFLINE REAL
  // ------------------------------
  useEffect(() => {
    if (!offlineSince) return;

    const interval = setInterval(async () => {
      const real = await checkRealInternet();

      // Se recuperó durante la ventana
      if (real) {
        setIsConnected(true);
        setOfflineSince(null);
        setOfflineLocked(false);
        setOfflineLockPending(false);
        return;
      }

      const elapsed = Date.now() - offlineSince;

      if (elapsed >= LIMIT) {
        if (isInQuiz) {
          setOfflineLockPending(true);
        } else {
          setOfflineLocked(true);
        }
      }
    }, CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [offlineSince, isInQuiz]);

  // ------------------------------
  // MINUTO EXTRA DESPUÉS DEL QUIZ
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

  // ------------------------------
  // CONTEXTO EXPUESTO
  // ------------------------------
  return (
    <OfflineContext.Provider
      value={{
        isConnected,
        checking,

        offlineSince,
        lostConnectionAt,
        connectionRecoveredAt,

        offlineLocked,
        offlineLockPending,

        isInQuiz,
        setQuizActive: setIsInQuiz,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
}

// ------------------------------
// HOOK
// ------------------------------
export function useOffline() {
  return useContext(OfflineContext);
}
