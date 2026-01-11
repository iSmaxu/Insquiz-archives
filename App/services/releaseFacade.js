// =====================================================
// INSQUIZ — Release Facade
// Orquesta LicenseContext + releaseService
// =====================================================

import { useCallback } from "react";
import { useLicense } from "../context/LicenseContext";
import { checkAndShowReleaseMessage } from "./releaseService";

export function useReleaseNotifier() {
  const { license, licenseStatus } = useLicense();

  const runReleaseCheck = useCallback(async () => {
    if (licenseStatus !== "active") return;
    if (!license?.type) return;

    await checkAndShowReleaseMessage(license.type);
  }, [licenseStatus, license?.type]);

  return { runReleaseCheck };
}
