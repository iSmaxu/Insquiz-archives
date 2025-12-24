// ==========================================================
// INSQUIZ — MaintenanceService (Expo Go SAFE)
// ==========================================================

import { ref, get } from "firebase/database";
import { db } from "../firebase/firebaseConfig";

export async function isMaintenanceActive() {
  try {
    const snap = await get(ref(db, "system/maintencement"));
    return snap.exists() && snap.val() === true;
  } catch (e) {
    console.log("MaintenanceService error:", e);
    return false; // 🚨 NUNCA bloquear por error
  }
}
