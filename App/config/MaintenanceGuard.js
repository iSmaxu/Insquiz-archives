// ==========================================================
// INSQUIZ — MaintenanceGuard (React Component)
// ==========================================================

import { useEffect } from "react";
import { isMaintenanceActive } from "../services/MaintenanceService";

export default function MaintenanceGuard({ navigationRef }) {
  useEffect(() => {
    let mounted = true;

    async function check() {
      const active = await isMaintenanceActive();
      if (!mounted) return;

      if (active && navigationRef?.current) {
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: "MaintenanceScreen" }],
        });
      }
    }

    check();
    const interval = setInterval(check, 30_000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [navigationRef]);

  return null; // los guards no renderizan UI
}
