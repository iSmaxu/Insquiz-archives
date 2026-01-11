// App/services/EreleaseService.js
// =====================================================
// INSQUIZ — ERelease Service (REAL-TIME DISPATCH)
// =====================================================
// - NO cache
// - SIEMPRE consulta Firebase
// - Match exacto licenseKey + deviceId
// - Muestra solo el ERelease más reciente no visto
// =====================================================

import { getDatabase, ref, get } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDeviceId } from "./DeviceIdService";

const SEEN_PREFIX = "ERELEASE_SEEN_";

// =====================================================
// FETCH — SIN CACHE
// =====================================================
export async function fetchEReleases() {
  try {
    const db = getDatabase();
    const snap = await get(ref(db, "ereleases/published"));
    return snap.exists() ? Object.values(snap.val()) : [];
  } catch (e) {
    console.log("❌ fetchEReleases error:", e);
    return [];
  }
}

// =====================================================
// RESOLVER — elige el MÁS RECIENTE no visto
// =====================================================
function resolveEffectiveERelease({
  releases,
  licenseKey,
  deviceId,
  seenMap,
}) {
  const candidates = releases.filter(r => {
    if (r?.schema !== "insquiz_dispatch@1") return false;
    if (r?.meta?.status !== "active") return false;

    const licenses = Array.isArray(r?.target?.licenseKey)
      ? r.target.licenseKey
      : [r?.target?.licenseKey];

    if (!licenses.includes(licenseKey)) return false;

    const devices = Array.isArray(r?.target?.deviceId)
      ? r.target.deviceId
      : [r?.target?.deviceId];

    if (!devices.includes(deviceId)) return false;

    const id = r?.meta?.id;
    if (!id || seenMap[id]) return false;

    return true;
  });

  if (!candidates.length) return null;

  candidates.sort(
    (a, b) => (b.meta?.createdAt || 0) - (a.meta?.createdAt || 0)
  );

  return candidates[0];
}

// =====================================================
// API PÚBLICA
// =====================================================
export async function checkAndConsumeERelease(licenseKey) {
  const deviceId = await getDeviceId();
  const releases = await fetchEReleases();

  const seenMap = {};
  for (const r of releases) {
    const id = r?.meta?.id;
    if (!id) continue;
    if ((await AsyncStorage.getItem(SEEN_PREFIX + id)) === "true") {
      seenMap[id] = true;
    }
  }

  const match = resolveEffectiveERelease({
    releases,
    licenseKey,
    deviceId,
    seenMap,
  });

  if (!match) return null;

  await AsyncStorage.setItem(SEEN_PREFIX + match.meta.id, "true");
  return match;
}
