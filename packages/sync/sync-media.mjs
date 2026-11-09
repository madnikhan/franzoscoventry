import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const src = path.join(root, "packages/shared/media");

const targets = [
  path.join(root, "apps/demo-next/public/media"),
  path.join(root, "apps/production-laravel/public/media"),
];

function copyDir(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, entry.name);
    const d = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

export function syncMedia() {
  for (const target of targets) {
    if (!fs.existsSync(path.dirname(target))) continue;
    copyDir(src, target);
  }
  return targets.filter((t) => fs.existsSync(path.dirname(t)));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("Synced media to", syncMedia());
}
