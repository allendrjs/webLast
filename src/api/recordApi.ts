import { apiClient } from "./client";
import type { ViolationRecord } from "../types/record";

// Mirrors org.rocs.osdrmsa.controller.record.RecordController -
// GET /api/records/student/{studentId}, guarded server-side by
// @access.isSelfStudent for STUDENT-role callers. For a STUDENT-role
// login, username IS the studentId (same assumption Mobile's
// SessionManager makes, confirmed correct against the seed data).
export async function getRecordsByStudent(studentId: string): Promise<ViolationRecord[]> {
  const response = await apiClient.get<ViolationRecord[]>(`/api/records/student/${studentId}`);
  return response.data;
}
