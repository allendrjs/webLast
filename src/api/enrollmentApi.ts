import { apiClient } from "./client";
import type { Enrollment } from "../types/enrollment";

// TODO(OSDA-web): wire up against the backend's enrollment-related controller
// once this feature is picked up. Endpoint path below is a placeholder -
// confirm the exact path against the live API before relying on it.
export async function getEnrollmentList(): Promise<Enrollment[]> {
  const response = await apiClient.get<Enrollment[]>("/api/enrollments");
  return response.data;
}
