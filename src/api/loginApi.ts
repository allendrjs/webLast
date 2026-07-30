import { apiClient } from "./client";
import type { LoginRequest, LoginResponse } from "../types/auth";

// Wraps POST /login. Throws on non-2xx - callers (AuthContext) are
// responsible for catching and mapping 401/403 to a user-facing message.
export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/login", request);
  return response.data;
}
