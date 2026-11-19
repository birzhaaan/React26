import { useState, useEffect, useRef } from "react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { usePwaUpdate } from "../hooks/usePwaUpdate";
import { refreshBaseRecipes } from "../services/service";

export default function ConnectionStatus() {
  const online = useOnlineStatus();
  const { updateReady, applyUpdate } = usePwaUpdate();

  const [restored, setRestored] = useState(false);
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!online) {
      wasOffline.current = true;
      setRestored(false);
      return;
    }

    if (!wasOffline.current) return;

    wasOffline.current = false;
    refreshBaseRecipes().catch(() => {});
    setRestored(true);

    const timer = setTimeout(() => setRestored(false), 6000);
    return () => clearTimeout(timer);
  }, [online]);

  if (updateReady) {
    return (
      <div className="banner banner-update" role="status">
        <span>A new version of Recipe Finder is available.</span>
        <button type="button" onClick={applyUpdate}>
          Update now
        </button>
      </div>
    );
  }

  if (!online) {
    return (
      <div className="banner banner-offline" role="status">
        <span>You are offline — showing data saved on this device.</span>
        <button type="button" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  if (restored) {
    return (
      <div className="banner banner-online" role="status">
        <span>Back online. Data has been refreshed.</span>
      </div>
    );
  }

  return null;
}