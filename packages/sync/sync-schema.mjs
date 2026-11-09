import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const domainPath = path.join(root, "packages/shared/schema/domain.json");

export function syncSchema() {
  const domain = JSON.parse(fs.readFileSync(domainPath, "utf8"));
  const written = [];

  const nextEnums = path.join(root, "apps/demo-next/src/lib/domain.ts");
  if (fs.existsSync(path.join(root, "apps/demo-next"))) {
    fs.mkdirSync(path.dirname(nextEnums), { recursive: true });
    const ts = `/* Auto-generated from packages/shared/schema/domain.json — do not edit */\n` +
      `export const ROLES = ${JSON.stringify(domain.roles, null, 2)} as const;\n` +
      `export const ORDER_TYPES = ${JSON.stringify(domain.orderTypes, null, 2)} as const;\n` +
      `export const ORDER_STATUSES = ${JSON.stringify(domain.orderStatuses, null, 2)} as const;\n` +
      `export const PAYMENT_STATUSES = ${JSON.stringify(domain.paymentStatuses, null, 2)} as const;\n` +
      `export const STATUS_FLOW = ${JSON.stringify(domain.statusFlow, null, 2)} as const;\n`;
    fs.writeFileSync(nextEnums, ts);
    written.push(nextEnums);
  }

  const laravelEnums = path.join(root, "apps/production-laravel/app/Support/Domain.php");
  if (fs.existsSync(path.join(root, "apps/production-laravel"))) {
    fs.mkdirSync(path.dirname(laravelEnums), { recursive: true });
    const php = `<?php\n\nnamespace App\\Support;\n\n/** Auto-generated from packages/shared/schema/domain.json — do not edit */\nclass Domain\n{\n    public const ROLES = ${phpArray(domain.roles)};\n    public const ORDER_TYPES = ${phpArray(domain.orderTypes)};\n    public const ORDER_STATUSES = ${phpArray(domain.orderStatuses)};\n    public const PAYMENT_STATUSES = ${phpArray(domain.paymentStatuses)};\n}\n`;
    fs.writeFileSync(laravelEnums, php);
    written.push(laravelEnums);
  }

  return written;
}

function phpArray(arr) {
  return "[" + arr.map((v) => `'${v}'`).join(", ") + "]";
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("Synced schema", syncSchema());
}
