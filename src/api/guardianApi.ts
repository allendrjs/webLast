import { apiClient } from "./client";
import type { Guardian } from "../types/guardian";

// TODO(OSDA-web): wire up against the backend's guardian-related controller
// once this feature is picked up. Endpoint path below is a placeholder -
// confirm the exact path against the live API before relying on it.
export async function getGuardianList(): Promise<Guardian[]> {
  const response = await apiClient.get<Guardian[]>("/api/guardians");
  return response.data;
}
