import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, extname, sep } from "node:path";
import { createHash } from "node:crypto";

const DIST = "dist";
const PRECACHE_EXTENSIONS = new Set([
  ".html",
  ".js",
  ".css",
  ".json",
  ".webmanifest",
  ".png",
  ".svg",
  ".woff2",
]);

const viteConfig = readFileSync("vite.config.js", "utf8");
const baseMatch = viteConfig.match(/base:\s*["'`]([^"'`]+)["'`]/);
const BASE = baseMatch ? baseMatch[1] : "/";

function walk(dir, found = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, found);
    } else {
      found.push(full);
    }
  }
  return found;
}

const files = walk(DIST)
  .filter((file) => !file.endsWith("sw.js"))
  .filter((file) => PRECACHE_EXTENSIONS.has(extname(file).toLowerCase()))
  .sort();

const urls = files.map(
  (file) => BASE + relative(DIST, file).split(sep).join("/")
);

const hash = createHash("sha256");
for (const file of files) {
  hash.update(readFileSync(file));
}
const version = hash.digest("hex").slice(0, 8);

const swPath = join(DIST, "sw.js");
const source = readFileSync(swPath, "utf8")
  .replace("__SW_VERSION__", version)
  .replace("__BASE_URL__", BASE)
  .replace('"__PRECACHE_URLS__"', JSON.stringify(urls, null, 2));

writeFileSync(swPath, source);

console.log(`[sw] version ${version}, ${urls.length} files precached`);