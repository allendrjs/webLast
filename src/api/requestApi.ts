import { apiClient } from "./client";
import type { RecordRequest } from "../types/request";

// TODO(OSDA-web): wire up against the backend's request-related controller
// once this feature is picked up. Endpoint path below is a placeholder -
// confirm the exact path against the live API before relying on it.
export async function getRecordRequestList(): Promise<RecordRequest[]> {
  const response = await apiClient.get<RecordRequest[]>("/api/requests");
  return response.data;
}
