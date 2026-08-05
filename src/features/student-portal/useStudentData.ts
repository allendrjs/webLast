import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../state/useAuth";
import { getRecordsByStudent } from "../../api/recordApi";
import { getAppealsByStudent } from "../../api/appealApi";
import { getLatestEnrollmentByStudent } from "../../api/enrollmentApi";
import { getGuardiansByStudent } from "../../api/guardianApi";
import type { ViolationRecord } from "../../types/record";
import type { Appeal } from "../../types/appeal";
import type { Enrollment } from "../../types/enrollment";
import type { Guardian } from "../../types/guardian";

interface StudentData {
  studentId: string | null;
  records: ViolationRecord[];
  appeals: Appeal[];
  enrollment: Enrollment | null;
  guardians: Guardian[];
  isLoading: boolean;
  error: string | null;
  reload: () => void;
}

// Shared data fetch for all four Student portal screens - for a
// ROLE_USER login, username IS the studentId (see recordApi.ts). Every
// screen needs some subset of {records, appeals, enrollment, guardians},
// so this loads all four together once per page mount rather than each
// screen re-implementing its own fetch/loading/error plumbing.
export function useStudentData(): StudentData {
  const { username } = useAuth();
  const [records, setRecords] = useState<ViolationRecord[]>([]);
  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  useEffect(() => {
    if (!username) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    Promise.all([
      getRecordsByStudent(username),
      getAppealsByStudent(username),
      getLatestEnrollmentByStudent(username).catch(() => null),
      getGuardiansByStudent(username).catch(() => []),
    ])
      .then(([recordsResult, appealsResult, enrollmentResult, guardiansResult]) => {
        if (cancelled) return;
        setRecords(recordsResult);
        setAppeals(appealsResult);
        setEnrollment(enrollmentResult);
        setGuardians(guardiansResult);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.response?.data?.message ?? "Could not load your records right now.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [username, reloadToken]);

  return { studentId: username, records, appeals, enrollment, guardians, isLoading, error, reload };
}
