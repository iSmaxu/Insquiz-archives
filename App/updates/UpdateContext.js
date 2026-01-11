// ==========================================================
//     INSQUIZ — UpdateContext (Sistema de Updates 2025)
// ==========================================================

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import * as Updates from "expo-updates";
import AsyncStorage from "@react-native-async-storage/async-storage";

// EDITABLE (para tests)
export const UPDATE_CHECK_INTERVAL = 0.5 * 1000; // 15m (pon 30_000 para test)
const LAST_UPDATE_ID_KEY = "@insquiz:last_update_id";

// Screens que SON quizes (permiten mini-bolita sin bloquear)
export const QUIZ_SCREENS = [
  "QuizScreen",
  "RealSimExam",
  "PracticeCardScreen",
  "PracticeQuizScreen",
  "AdaptiveQuizScreen",
  "BootScreen"
];

const UpdateContext = createContext(null);
export const useUpdateInfo = () => useContext(UpdateContext);

export function UpdateProvider({ children }) {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [pendingUpdateId, setPendingUpdateId] = useState(null);
  const checkingRef = useRef(false);

  // Guardar el update aplicado para evitar "updates fantasma"
  async function saveLastUpdateId(id) {
    try {
      await AsyncStorage.setItem(LAST_UPDATE_ID_KEY, id);
    } catch (e) {
      console.log("[Update] Error guardando lastUpdateId:", e);
    }
  }

  async function checkForUpdates() {
    if (checkingRef.current) return;
    checkingRef.current = true;

    try {

      const result = await Updates.checkForUpdateAsync();
      if (!result.isAvailable) {
        console.log("[Update] No hay updates.");
        setUpdateAvailable(false);
        setPendingUpdateId(null);
        setUpdateMessage("");
        checkingRef.current = false;
        return;
      }

      console.log("[Update] Update encontrado. Descargando…");
      const fetchRes = await Updates.fetchUpdateAsync();
      const manifest = fetchRes?.manifest || result.manifest || {};

      const newId = manifest?.id || manifest?.revisionId || "unknown";
      const msg = manifest?.message || manifest?.extra?.eas?.message || "Nueva actualización disponible";

      const lastId = await AsyncStorage.getItem(LAST_UPDATE_ID_KEY);

      if (lastId && lastId === newId) {
        console.log("[Update] Ya aplicado antes → ignorando.");
        setUpdateAvailable(false);
        setPendingUpdateId(null);
        setUpdateMessage("");
      } else {
        console.log("[Update] Update listo:", newId, msg);
        setPendingUpdateId(newId);
        setUpdateMessage(msg);
        setUpdateAvailable(true);
      }
    } catch (e) {

    }

    checkingRef.current = false;
  }

  // Aplicar update obligatorio
  async function applyUpdate() {
    try {
      if (pendingUpdateId) {
        await saveLastUpdateId(pendingUpdateId);
      }
      await Updates.reloadAsync();
    } catch (e) {
      console.log("[Update] Error aplicando update:", e);
    }
  }

  // Chequeo inicial + loop continuo
  useEffect(() => {
    checkForUpdates();

    const interval = setInterval(() => {
      checkForUpdates();
    }, UPDATE_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <UpdateContext.Provider
      value={{
        updateAvailable,
        updateMessage,
        applyUpdate,
        pendingUpdateId
      }}
    >
      {children}
    </UpdateContext.Provider>
  );
}
