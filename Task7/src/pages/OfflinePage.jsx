import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { probeConnection } from "../services/pwa";

export default function OfflinePage() {
  const online = useOnlineStatus();
  const navigate = useNavigate();

  const [checking, setChecking] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleRetry() {
    setChecking(true);
    setFailed(false);

    const reachable = await probeConnection();

    setChecking(false);

    if (reachable) {
      navigate("/", { replace: true });
    } else {
      setFailed(true);
    }
  }

  return (
    <div className="offline-page">
      <div className="offline-mark">!</div>

      <h1>You are offline</h1>

      <p className="lead">
        This part of the app needs a connection. Pages and recipes you opened
        earlier are still available from your device.
      </p>

      <p className="offline-state">
        Browser reports: <strong>{online ? "online" : "offline"}</strong>
      </p>

      <div className="offline-actions">
        <button
          type="button"
          className="btn-primary"
          onClick={handleRetry}
          disabled={checking}
        >
          {checking ? "Checking..." : "Retry connection"}
        </button>
        <Link to="/recipes" className="btn-link">
          Saved recipes
        </Link>
      </div>

      {failed && (
        <p className="offline-failed">
          Still no connection. Try again in a moment.
        </p>
      )}
    </div>
  );
}