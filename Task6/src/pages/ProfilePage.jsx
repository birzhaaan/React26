import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default function ProfilePage() {
  const { user, logOut } = useAuth();
  const [busy, setBusy] = useState(false);

  async function handleLogout() {
    setBusy(true);
    try {
      await logOut();
    } catch {
      setBusy(false);
    }
  }

  const provider = user.providerData[0]?.providerId === "google.com"
    ? "Google"
    : "Email / Password";

  return (
    <div className="profile-page">
      <h1>Profile</h1>

      <div className="profile-card">
        <div className="profile-row">
          <span className="profile-label">Email</span>
          <span className="profile-value">{user.email}</span>
        </div>

        <div className="profile-row">
          <span className="profile-label">User ID</span>
          <span className="profile-value profile-uid">{user.uid}</span>
        </div>

        <div className="profile-row">
          <span className="profile-label">Sign-in method</span>
          <span className="profile-value">{provider}</span>
        </div>

        <div className="profile-row">
          <span className="profile-label">Account created</span>
          <span className="profile-value">
            {formatDate(user.metadata?.creationTime)}
          </span>
        </div>

        <div className="profile-row">
          <span className="profile-label">Last sign-in</span>
          <span className="profile-value">
            {formatDate(user.metadata?.lastSignInTime)}
          </span>
        </div>
      </div>

      <div className="profile-actions">
        <button className="btn-primary" onClick={handleLogout} disabled={busy}>
          {busy ? "Signing out..." : "Sign out"}
        </button>
        <Link to="/recipes" className="btn-link">Browse recipes</Link>
      </div>
    </div>
  );
}