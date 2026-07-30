import { apiClient } from "./client";
import type { ViolationRecord } from "../types/record";

// TODO(OSDA-web): wire up against the backend's record-related controller
// once this feature is picked up. Endpoint path below is a placeholder -
// confirm the exact path against the live API before relying on it.
export async function getViolationRecordList(): Promise<ViolationRecord[]> {
  const response = await apiClient.get<ViolationRecord[]>("/api/records");
  return response.data;
}
