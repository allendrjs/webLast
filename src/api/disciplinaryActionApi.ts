import { apiClient } from "./client";
import type { DisciplinaryAction } from "../types/disciplinaryAction";

// TODO(OSDA-web): wire up against the backend's disciplinaryAction-related controller
// once this feature is picked up. Endpoint path below is a placeholder -
// confirm the exact path against the live API before relying on it.
export async function getDisciplinaryActionList(): Promise<DisciplinaryAction[]> {
  const response = await apiClient.get<DisciplinaryAction[]>("/api/disciplinary-actions");
  return response.data;
}
