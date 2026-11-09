import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { syncMedia } from "../packages/sync/sync-media.mjs";
import { syncTokens } from "../packages/sync/sync-tokens.mjs";
import { syncMenuSeed } from "../packages/sync/sync-menu-seed.mjs";
import { syncSchema } from "../packages/sync/sync-schema.mjs";
import { generateParityReport } from "../packages/sync/generate-parity-report.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const version = new Date().toISOString();

const results = {
  media: syncMedia(),
  tokens: syncTokens(),
  menu: syncMenuSeed(),
  schema: syncSchema(),
};

const stamp = JSON.stringify({ SHARED_SYNC_VERSION: version, syncedAt: version }, null, 2);
for (const dest of [
  path.join(root, "apps/demo-next/src/data/sync-version.json"),
  path.join(root, "apps/production-laravel/storage/app/shared/sync-version.json"),
  path.join(root, "packages/shared/SYNC_VERSION.json"),
]) {
  const appOk =
    dest.includes("packages/shared") ||
    fs.existsSync(path.dirname(path.dirname(dest))) ||
    fs.existsSync(path.dirname(dest));
  const base = dest.includes("demo-next")
    ? path.join(root, "apps/demo-next")
    : dest.includes("production-laravel")
      ? path.join(root, "apps/production-laravel")
      : root;
  if (!fs.existsSync(base) && !dest.includes("packages/shared")) continue;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, stamp);
}

generateParityReport(version);

console.log("Franzos sync complete", { version, ...results });
