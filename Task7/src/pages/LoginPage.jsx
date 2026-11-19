import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { user, logIn, logInWithGoogle, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/profile";

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  useEffect(() => clearError, [clearError]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await logIn(email, password);
    } catch {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setSubmitting(true);
    try {
      await logInWithGoogle();
    } catch {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <h1>Sign in</h1>
      <p className="lead">Welcome back. Sign in to access your profile.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </label>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <div className="auth-divider"><span>or</span></div>

      <button
        type="button"
        className="btn-google"
        onClick={handleGoogle}
        disabled={submitting}
      >
        Continue with Google
      </button>

      <p className="auth-switch">
        No account yet? <Link to="/signup">Create one</Link>
      </p>
    </div>
  );
}