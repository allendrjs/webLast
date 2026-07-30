import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../state/useAuth";

// Reference implementation for the "Feature for Login" ticket - UI,
// State/Logic (via useAuth/AuthContext), and API Integration (via
// loginApi.ts) all wired together. Other features should follow this same
// three-layer split.
export function LoginPage() {
  const { login, isAuthenticated, isLoading, error } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const canSubmit = username.trim().length > 0 && password.length > 0 && !isLoading;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    try {
      await login(username.trim(), password);
    } catch {
      // Error is already captured in AuthContext's `error` state; nothing
      // further to do here.
    }
  }

  return (
    <main>
      <h1>OSDA Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
        />

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={!canSubmit}>
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
