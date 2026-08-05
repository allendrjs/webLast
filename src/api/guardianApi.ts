import { apiClient } from "./client";
import type { Guardian } from "../types/guardian";

// Mirrors org.rocs.osdrmsa.controller.guardian.GuardianController -
// GET /api/guardians/student/{studentId}, guarded server-side by
// @access.isSelfStudent for STUDENT-role callers.
export async function getGuardiansByStudent(studentId: string): Promise<Guardian[]> {
  const response = await apiClient.get<Guardian[]>(`/api/guardians/student/${studentId}`);
  return response.data;
}
