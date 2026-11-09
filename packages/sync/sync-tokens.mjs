import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const tokens = path.join(root, "packages/shared/brand/tokens.css");
const copy = path.join(root, "packages/shared/brand/copy.json");

export function syncTokens() {
  const written = [];
  const nextCss = path.join(root, "apps/demo-next/src/styles/tokens.css");
  const laravelCss = path.join(root, "apps/production-laravel/resources/css/tokens.css");
  const nextCopy = path.join(root, "apps/demo-next/src/data/copy.json");
  const laravelCopy = path.join(root, "apps/production-laravel/storage/app/shared/copy.json");

  for (const [src, dest] of [
    [tokens, nextCss],
    [tokens, laravelCss],
    [copy, nextCopy],
    [copy, laravelCopy],
  ]) {
    if (!fs.existsSync(path.dirname(path.dirname(dest))) && !dest.includes("demo-next") && !dest.includes("production-laravel")) {
      continue;
    }
    const parent = path.dirname(dest);
    if (!fs.existsSync(path.dirname(parent)) && !fs.existsSync(parent)) {
      // ensure app root exists
      const appRoot = dest.includes("demo-next")
        ? path.join(root, "apps/demo-next")
        : path.join(root, "apps/production-laravel");
      if (!fs.existsSync(appRoot)) continue;
    }
    fs.mkdirSync(parent, { recursive: true });
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      written.push(dest);
    }
  }
  return written;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("Synced tokens", syncTokens());
}
