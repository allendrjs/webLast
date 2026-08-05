import { apiClient } from "./client";
import type { Appeal } from "../types/appeal";

export interface AppealFileRequest {
  recordId: number;
  enrollmentId: number;
  message: string;
}

// Mirrors org.rocs.osdrmsa.controller.appeal.AppealController -
// GET /api/appeals/student/{studentId}, guarded server-side by
// @access.isSelfStudent for STUDENT-role callers.
export async function getAppealsByStudent(studentId: string): Promise<Appeal[]> {
  const response = await apiClient.get<Appeal[]>(`/api/appeals/student/${studentId}`);
  return response.data;
}

// POST /api/appeals - Student-only (hasRole('USER')). The backend trusts
// the client-supplied recordId/enrollmentId rather than cross-checking
// they belong to the caller - a known, documented gap on the backend
// (see AppealController's own javadoc), not something this call can fix.
export async function fileAppeal(request: AppealFileRequest): Promise<Appeal> {
  const response = await apiClient.post<Appeal>("/api/appeals", request);
  return response.data;
}
