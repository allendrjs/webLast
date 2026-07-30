import { apiClient } from "./client";
import type { Appeal } from "../types/appeal";

// TODO(OSDA-web): wire up against the backend's appeal-related controller
// once this feature is picked up. Endpoint path below is a placeholder -
// confirm the exact path against the live API before relying on it.
export async function getAppealList(): Promise<Appeal[]> {
  const response = await apiClient.get<Appeal[]>("/api/appeals");
  return response.data;
}
