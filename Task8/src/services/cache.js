export const DEFAULT_TTL = 5 * 60 * 1000;

const entries = new Map();
const pending = new Map();

export function buildKey(resource, params = {}) {
  const query = Object.keys(params)
    .sort()
    .filter((name) => {
      const value = params[name];
      return value !== "" && value !== null && value !== undefined;
    })
    .map((name) => `${name}=${params[name]}`)
    .join("&");

  return query ? `${resource}?${query}` : resource;
}

export function readCache(key) {
  const entry = entries.get(key);

  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    entries.delete(key);
    return null;
  }

  return entry.data;
}

export function writeCache(key, data, ttl = DEFAULT_TTL) {
  entries.set(key, {
    data,
    storedAt: Date.now(),
    expiresAt: Date.now() + ttl,
  });
}

export function invalidate(resource) {
  for (const key of entries.keys()) {
    if (key === resource || key.startsWith(`${resource}?`)) {
      entries.delete(key);
    }
  }
}

export function clearCache() {
  entries.clear();
  pending.clear();
}

export async function withCache(key, fetcher, ttl = DEFAULT_TTL) {
  const cached = readCache(key);
  if (cached !== null) {
    return { data: cached, fromCache: true };
  }

  if (pending.has(key)) {
    return { data: await pending.get(key), fromCache: true };
  }

  const request = fetcher();
  pending.set(key, request);

  try {
    const data = await request;
    writeCache(key, data, ttl);
    return { data, fromCache: false };
  } finally {
    pending.delete(key);
  }
}

export function getCacheStats() {
  const now = Date.now();
  return {
    size: entries.size,
    keys: [...entries.entries()].map(([key, entry]) => ({
      key,
      ageSeconds: Math.round((now - entry.storedAt) / 1000),
      expiresInSeconds: Math.round((entry.expiresAt - now) / 1000),
    })),
  };
}