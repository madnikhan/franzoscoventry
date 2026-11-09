import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const menu = path.join(root, "packages/shared/menu/seed.json");
const business = path.join(root, "packages/shared/config/business.json");
const domain = path.join(root, "packages/shared/schema/domain.json");
const dishes = path.join(root, "packages/shared/data/dishes.json");

export function syncMenuSeed() {
  const written = [];
  const pairs = [
    [menu, path.join(root, "apps/demo-next/src/data/menu.seed.json")],
    [business, path.join(root, "apps/demo-next/src/data/business.json")],
    [domain, path.join(root, "apps/demo-next/src/data/domain.json")],
    [dishes, path.join(root, "apps/demo-next/src/data/dishes.json")],
    [menu, path.join(root, "apps/production-laravel/database/data/menu.seed.json")],
    [business, path.join(root, "apps/production-laravel/database/data/business.json")],
    [domain, path.join(root, "apps/production-laravel/database/data/domain.json")],
    [dishes, path.join(root, "apps/production-laravel/public/data/dishes.json")],
  ];

  for (const [src, dest] of pairs) {
    const appRoot = dest.includes("demo-next")
      ? path.join(root, "apps/demo-next")
      : path.join(root, "apps/production-laravel");
    if (!fs.existsSync(appRoot) || !fs.existsSync(src)) continue;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    written.push(dest);
  }

  // Laravel PHP config from business.json
  const laravelApp = path.join(root, "apps/production-laravel");
  if (fs.existsSync(laravelApp) && fs.existsSync(business)) {
    const biz = JSON.parse(fs.readFileSync(business, "utf8"));
    const php = `<?php\n\nreturn ${phpExport(biz)};\n`;
    const dest = path.join(laravelApp, "config/franzos.php");
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, php);
    written.push(dest);
  }

  return written;
}

function phpExport(value, indent = 0) {
  const pad = "    ".repeat(indent);
  const padIn = "    ".repeat(indent + 1);
  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return `'${value.replace(/'/g, "\\'")}'`;
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const isList = value.every((_, i) => Object.prototype.hasOwnProperty.call(value, i));
    const body = value
      .map((v, i) => {
        if (Array.isArray(value) && isList && value.every((x, idx) => typeof idx === "number")) {
          // sequential array
        }
        const key = Array.isArray(value) ? null : i;
        return key === null
          ? `${padIn}${phpExport(v, indent + 1)}`
          : `${padIn}${phpExport(v, indent + 1)}`;
      })
      .join(",\n");
    // Better array handling
    if (Array.isArray(value)) {
      const items = value.map((v) => `${padIn}${phpExport(v, indent + 1)}`).join(",\n");
      return `[\n${items},\n${pad}]`;
    }
  }
  if (typeof value === "object") {
    const items = Object.entries(value)
      .map(([k, v]) => `${padIn}'${k}' => ${phpExport(v, indent + 1)}`)
      .join(",\n");
    return `[\n${items},\n${pad}]`;
  }
  return "null";
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("Synced menu/config", syncMenuSeed());
}
