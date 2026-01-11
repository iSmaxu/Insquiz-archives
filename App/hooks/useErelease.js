// App/hooks/useERelease.js
// =============================================
// Hook React para consumir ERelease
// =============================================

import { useEffect, useState } from "react";
import { fetchEReleases, resolveEffectiveERelease } from "../services/EreleaseService";
import { getDeviceId } from "../services/DeviceIdService";

export default function useERelease({ licenseKey }) {
  const [loading, setLoading] = useState(true);
  const [dispatch, setDispatch] = useState(null);

  useEffect(() => {
    let alive = true;

    async function run() {
      setLoading(true);

      const deviceId = await getDeviceId();
      const releases = await fetchEReleases();
      if (!alive) return;

      const eff = resolveEffectiveERelease({
        releases,
        licenseKey,
        deviceId,
      });

      setDispatch(eff);
      setLoading(false);
    }

    run();
    return () => {
      alive = false;
    };
  }, [licenseKey]);

  return {
    loading,
    dispatch, // null o el objeto completo
  };
}
