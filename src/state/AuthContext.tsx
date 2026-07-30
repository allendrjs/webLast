import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";
import { login as loginRequest } from "../api/loginApi";
import type { LoginResponse, Role } from "../types/auth";

const TOKEN_KEY = "osda_token";
const USER_KEY = "osda_user";

interface AuthState {
  token: string | null;
  username: string | null;
  role: Role | null;
  authorities: string | null;
}

interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadStoredUser(): AuthState {
  const token = localStorage.getItem(TOKEN_KEY);
  const rawUser = localStorage.getItem(USER_KEY);
  if (!token || !rawUser) {
    return { token: null, username: null, role: null, authorities: null };
  }
  const user = JSON.parse(rawUser) as Pick<LoginResponse, "username" | "role" | "authorities">;
  return { token, username: user.username, role: user.role, authorities: user.authorities };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(loadStoredUser);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginRequest({ username, password });
      localStorage.setItem(TOKEN_KEY, response.token);
      localStorage.setItem(
        USER_KEY,
        JSON.stringify({ username: response.username, role: response.role, authorities: response.authorities })
      );
      setState({
        token: response.token,
        username: response.username,
        role: response.role,
        authorities: response.authorities,
      });
    } catch (err: any) {
      // Backend returns 401 for bad credentials, 403 with ACCOUNT_LOCKED /
      // ACCOUNT_INACTIVE for disabled accounts - surface the server's own
      // message when present rather than a generic one.
      const message = err?.response?.data?.message ?? "Login failed. Please try again.";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setState({ token: null, username: null, role: null, authorities: null });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      isAuthenticated: state.token !== null,
      login,
      logout,
      error,
      isLoading,
    }),
    [state, login, logout, error, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
