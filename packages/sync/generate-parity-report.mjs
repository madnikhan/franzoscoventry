import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

export function generateParityReport(version) {
  const featuresPath = path.join(root, "packages/shared/parity/features.json");
  const features = JSON.parse(fs.readFileSync(featuresPath, "utf8"));
  const lines = [
    `# Franzos parity report`,
    ``,
    `SHARED_SYNC_VERSION: \`${version}\``,
    ``,
    `## Routes`,
    ...features.routes.map((r) => `- ${r}`),
    ``,
    `## Features`,
    `| Feature | Demo | Laravel |`,
    `|---|---|---|`,
    ...Object.entries(features.features).map(
      ([k, v]) => `| ${k} | ${v.demo ? "yes" : "no"} | ${v.laravel ? "yes" : "no"} |`
    ),
    ``,
  ];
  const out = path.join(root, "parity-report.md");
  fs.writeFileSync(out, lines.join("\n"));
  return out;
}
