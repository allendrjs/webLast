import { apiClient } from "./client";
import type { Employee } from "../types/employee";

// TODO(OSDA-web): wire up against the backend's employee-related controller
// once this feature is picked up. Endpoint path below is a placeholder -
// confirm the exact path against the live API before relying on it.
export async function getEmployeeList(): Promise<Employee[]> {
  const response = await apiClient.get<Employee[]>("/api/employees");
  return response.data;
}
