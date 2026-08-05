import { apiClient } from "./client";
import type { Enrollment } from "../types/enrollment";

// Mirrors org.rocs.osdrmsa.controller.enrollment.EnrollmentController -
// GET /api/enrollments/student/{studentId}/latest, guarded server-side by
// @access.isSelfStudent for STUDENT-role callers. Returns the raw
// Enrollment entity (see types/enrollment.ts for why), so callers get
// null back (404) rather than an error when a student has no enrollment
// on file - handle that case, don't assume it always resolves.
export async function getLatestEnrollmentByStudent(studentId: string): Promise<Enrollment | null> {
  const response = await apiClient.get<Enrollment>(`/api/enrollments/student/${studentId}/latest`);
  return response.data ?? null;
}
