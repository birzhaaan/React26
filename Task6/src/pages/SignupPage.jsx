import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export default function SignupPage() {
  const { user, signUp, logInWithGoogle, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [localError, setLocalError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) navigate("/profile", { replace: true });
  }, [user, navigate]);

  useEffect(() => clearError, [clearError]);

  function validate() {
    if (!email.includes("@")) return "Please enter a valid email address.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirm) return "Passwords do not match.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const problem = validate();
    if (problem) {
      setLocalError(problem);
      return;
    }

    setLocalError(null);
    setSubmitting(true);
    try {
      await signUp(email, password);
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
      <h1>Create account</h1>
      <p className="lead">Sign up to save and manage your recipes.</p>

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
            placeholder="At least 6 characters"
            autoComplete="new-password"
            required
          />
        </label>

        <label>
          Confirm password
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat your password"
            autoComplete="new-password"
            required
          />
        </label>

        {(localError || error) && (
          <p className="auth-error">{localError || error}</p>
        )}

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Creating account..." : "Create account"}
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
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}