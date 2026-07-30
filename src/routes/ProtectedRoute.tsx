import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../state/useAuth";
import type { Role } from "../types/auth";

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

// Guards a route subtree behind authentication, and optionally behind a
// specific set of roles (e.g. only ROLE_ADMIN can reach Employee
// Management). Unauthenticated users are redirected to /login; authenticated
// users whose role isn't in allowedRoles are redirected to / rather than
// shown a broken page.
export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
