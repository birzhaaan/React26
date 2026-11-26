const SW_URL = `${import.meta.env.BASE_URL}sw.js`;
const UPDATE_INTERVAL = 60 * 60 * 1000;

let reloading = false;

export function registerServiceWorker({ onUpdateReady } = {}) {
  if (!("serviceWorker" in navigator)) return;
  if (!import.meta.env.PROD) return;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (reloading) return;
    reloading = true;
    window.location.reload();
  });

  const start = async () => {
    try {
      const registration = await navigator.serviceWorker.register(SW_URL, {
        scope: import.meta.env.BASE_URL,
        updateViaCache: "none",
      });

      if (registration.waiting && navigator.serviceWorker.controller) {
        onUpdateReady?.(registration);
      }

      registration.addEventListener("updatefound", () => {
        const installing = registration.installing;
        if (!installing) return;

        installing.addEventListener("statechange", () => {
          if (
            installing.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            onUpdateReady?.(registration);
          }
        });
      });

      setInterval(() => registration.update(), UPDATE_INTERVAL);

      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          registration.update();
        }
      });
    } catch (error) {
      console.warn("[pwa] registration failed", error);
    }
  };

  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start, { once: true });
  }
}

export function applyUpdate(registration) {
  registration?.waiting?.postMessage({ type: "SKIP_WAITING" });
}

export async function probeConnection() {
  try {
    const response = await fetch(
      `${import.meta.env.BASE_URL}manifest.webmanifest?probe=${Date.now()}`,
      { cache: "no-store" }
    );
    return response.ok;
  } catch {
    return false;
  }
}