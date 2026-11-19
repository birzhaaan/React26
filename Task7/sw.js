const VERSION = "7f9af7ef";
const BASE = "/React26/Task7/";
const PRECACHE_URLS = [
  "/React26/Task7/assets/AboutPage-C_pNCfE0.js",
  "/React26/Task7/assets/DashboardPage-Cwl5g6fn.js",
  "/React26/Task7/assets/LoginPage-C-PRE1ln.js",
  "/React26/Task7/assets/NotFoundPage-CoKVG3Bp.js",
  "/React26/Task7/assets/OfflinePage-B2TnOjRL.js",
  "/React26/Task7/assets/ProfilePage-DLmA9Gpd.js",
  "/React26/Task7/assets/RecipeDetailPage-iaZ1a6UJ.js",
  "/React26/Task7/assets/SignupPage-BZQ_iaGq.js",
  "/React26/Task7/assets/index-DcGEFqu4.css",
  "/React26/Task7/assets/index-DtzNOQjo.js",
  "/React26/Task7/assets/rec-BVaNFc02.png",
  "/React26/Task7/data/recipes.json",
  "/React26/Task7/favicon.svg",
  "/React26/Task7/icons.svg",
  "/React26/Task7/icons/apple-touch-icon.png",
  "/React26/Task7/icons/icon-192.png",
  "/React26/Task7/icons/icon-512.png",
  "/React26/Task7/icons/icon-maskable-512.png",
  "/React26/Task7/index.html",
  "/React26/Task7/manifest.webmanifest",
  "/React26/Task7/offline.html"
];

const SHELL_CACHE = `rf-shell-${VERSION}`;
const ASSET_CACHE = `rf-assets-${VERSION}`;
const DATA_CACHE = `rf-data-${VERSION}`;
const CURRENT_CACHES = [SHELL_CACHE, ASSET_CACHE, DATA_CACHE];

const APP_SHELL_URL = `${BASE}index.html`;
const OFFLINE_URL = `${BASE}offline.html`;

const MAX_ASSET_ENTRIES = 60;
const MAX_DATA_ENTRIES = 20;
const DATA_MAX_AGE = 24 * 60 * 60 * 1000;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);

      const requests = PRECACHE_URLS.map(
        (url) => new Request(url, { cache: "reload" })
      );

      await cache.addAll(requests);
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();

      await Promise.all(
        names
          .filter((name) => name.startsWith("rf-") && !CURRENT_CACHES.includes(name))
          .map((name) => caches.delete(name))
      );

      await purgeExpiredData();
      await self.clients.claim();
    })()
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.searchParams.has("probe")) return;

  if (url.origin !== self.location.origin) {
    if (isFontRequest(url)) {
      event.respondWith(cacheFirst(request, ASSET_CACHE, MAX_ASSET_ENTRIES));
    }
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (url.pathname.startsWith(`${BASE}data/`)) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, ASSET_CACHE, MAX_ASSET_ENTRIES));
  }
});

async function handleNavigation(request) {
  try {
    return await fetch(request);
  } catch {
    const shell = await caches.match(APP_SHELL_URL);
    if (shell) return shell;

    const offline = await caches.match(OFFLINE_URL);
    if (offline) return offline;

    return new Response("You are offline.", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    });
  }
}

async function cacheFirst(request, cacheName, maxEntries) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);

    if (response.ok || response.type === "opaque") {
      const cache = await caches.open(cacheName);
      await cache.put(request, response.clone());
      await trimCache(cacheName, maxEntries);
    }

    return response;
  } catch {
    return new Response("", { status: 504, statusText: "Offline" });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(DATA_CACHE);
      const stamped = await withHeaders(response.clone(), {
        "X-SW-Cached-At": String(Date.now()),
      });
      await cache.put(request, stamped);
      await trimCache(DATA_CACHE, MAX_DATA_ENTRIES);
    }

    return withHeaders(response, { "X-SW-Source": "network" });
  } catch {
    const cached = await caches.match(request);

    if (cached) {
      return withHeaders(cached, { "X-SW-Source": "cache" });
    }

    return new Response(JSON.stringify({ error: "offline" }), {
      status: 503,
      headers: { "Content-Type": "application/json", "X-SW-Source": "none" },
    });
  }
}

function isFontRequest(url) {
  return (
    url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com"
  );
}

function isStaticAsset(url) {
  return /\.(?:js|css|png|jpe?g|svg|webp|ico|woff2?|webmanifest)$/i.test(
    url.pathname
  );
}

async function withHeaders(response, extra) {
  const body = await response.blob();
  const headers = new Headers(response.headers);

  for (const [name, value] of Object.entries(extra)) {
    headers.set(name, value);
  }

  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length <= maxEntries) return;

  for (const key of keys.slice(0, keys.length - maxEntries)) {
    await cache.delete(key);
  }
}

async function purgeExpiredData() {
  const cache = await caches.open(DATA_CACHE);

  for (const request of await cache.keys()) {
    const response = await cache.match(request);
    const cachedAt = Number(response?.headers.get("X-SW-Cached-At") || 0);

    if (cachedAt && Date.now() - cachedAt > DATA_MAX_AGE) {
      await cache.delete(request);
    }
  }
}