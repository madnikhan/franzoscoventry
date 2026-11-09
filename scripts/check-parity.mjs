import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const features = JSON.parse(
  fs.readFileSync(path.join(root, "packages/shared/parity/features.json"), "utf8")
);

let failed = false;
for (const [key, val] of Object.entries(features.features)) {
  if (val.demo && !val.laravel) {
    console.error(`Parity fail: ${key} is in demo but missing in laravel`);
    failed = true;
  }
}

const sharedVersion = path.join(root, "packages/shared/SYNC_VERSION.json");
const laravelVersion = path.join(
  root,
  "apps/production-laravel/storage/app/shared/sync-version.json"
);
if (fs.existsSync(path.join(root, "apps/production-laravel"))) {
  if (!fs.existsSync(laravelVersion)) {
    console.error("Laravel sync-version missing — run npm run sync");
    failed = true;
  } else if (fs.existsSync(sharedVersion)) {
    const a = JSON.parse(fs.readFileSync(sharedVersion, "utf8")).SHARED_SYNC_VERSION;
    const b = JSON.parse(fs.readFileSync(laravelVersion, "utf8")).SHARED_SYNC_VERSION;
    if (a !== b) {
      console.error(`Sync version mismatch shared=${a} laravel=${b}`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log("Parity check passed");
