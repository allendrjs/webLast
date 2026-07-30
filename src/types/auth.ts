// Mirrors org.rocs.osdrmsa.domain.login.Role - values already carry the
// ROLE_ prefix, so @PreAuthorize on the backend uses hasAuthority(), never
// hasRole(). Follow the same convention on this side when comparing roles.
export type Role = "ROLE_ADMIN" | "ROLE_PREFECT" | "ROLE_STAFF" | "ROLE_USER";

export interface LoginRequest {
  username: string;
  password: string;
}

// Mirrors LoginResponse from LoginController.
export interface LoginResponse {
  token: string;
  username: string;
  role: Role | null;
  authorities: string | null;
  personId?: number;
}

export interface ApiErrorBody {
  timestamp: string;
  status: number;
  code: string;
  message: string;
}
