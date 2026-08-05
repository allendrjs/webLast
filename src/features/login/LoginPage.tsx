import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../state/useAuth";
import { PrimaryButton } from "../../components/ui/Button";

// Reference implementation for the "Feature for Login" ticket - UI,
// State/Logic (via useAuth/AuthContext), and API Integration (via
// loginApi.ts) all wired together. Other features should follow this same
// three-layer split.
//
// Styled to match mobLast's LoginScreen.kt per "the login will be based on
// the mobile login": centered card, navy circular mark, the identifier
// field labeled "STUDENT ID" rather than "Username". The underlying field
// and API call are still `username` - for STUDENT accounts the login
// username IS the student ID, same assumption used throughout Mobile.
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
    <main className="osda-login-page">
      <div className="osda-login-card">
        <div className="osda-login-mark">ROC</div>
        <h1 className="osda-login-title">Discipline Record Access</h1>
        <p className="osda-login-subtitle">Sign in with your Student ID</p>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <div className="osda-login-field">
            <label className="osda-input-label" htmlFor="username">
              Student ID
            </label>
            <input
              id="username"
              className="osda-input"
              type="text"
              placeholder="e.g. CT23-0010"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="osda-login-field">
            <label className="osda-input-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="osda-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p role="alert" className="osda-error-text" style={{ marginBottom: 12 }}>
              {error}
            </p>
          )}

          <PrimaryButton type="submit" disabled={!canSubmit}>
            {isLoading ? "Signing in..." : "Sign In"}
          </PrimaryButton>
        </form>
      </div>
    </main>
  );
}
