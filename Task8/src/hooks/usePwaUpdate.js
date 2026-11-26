import { useState, useEffect } from "react";
import { registerServiceWorker, applyUpdate } from "../services/pwa";

export function usePwaUpdate() {
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    registerServiceWorker({ onUpdateReady: setRegistration });
  }, []);

  return {
    updateReady: Boolean(registration),
    applyUpdate: () => applyUpdate(registration),
  };
}