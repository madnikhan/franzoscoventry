#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

CHANGED="$(git diff --cached --name-only || true)"
if echo "$CHANGED" | grep -qE '^(packages/shared/|apps/demo-next/public/)'; then
  echo "Running Franzos shared sync…"
  node scripts/sync-all.mjs
  node scripts/check-parity.mjs
  git add apps/demo-next/src/data apps/demo-next/src/styles apps/demo-next/public/media \
    apps/production-laravel/database/data apps/production-laravel/config/franzos.php \
    apps/production-laravel/resources/css/tokens.css apps/production-laravel/public/media \
    apps/production-laravel/storage/app/shared apps/production-laravel/app/Support/Domain.php \
    packages/shared/SYNC_VERSION.json parity-report.md 2>/dev/null || true
fi
