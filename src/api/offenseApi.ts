import { apiClient } from "./client";
import type { Offense } from "../types/offense";

// TODO(OSDA-web): wire up against the backend's offense-related controller
// once this feature is picked up. Endpoint path below is a placeholder -
// confirm the exact path against the live API before relying on it.
export async function getOffenseList(): Promise<Offense[]> {
  const response = await apiClient.get<Offense[]>("/api/offenses");
  return response.data;
}
