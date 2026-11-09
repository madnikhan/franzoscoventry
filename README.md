# Franzos Coventry — Dual-Stack Platform

Peri chicken restaurant platform for **Franzos Coventry** (14 Corporation St, CV1 1GF).

| Target | App | Host |
|--------|-----|------|
| **Demo** (client testing) | [`apps/demo-next`](apps/demo-next) — Next.js 15 | **Vercel** |
| **Production** (live) | [`apps/production-laravel`](apps/production-laravel) — Laravel 12 | **IONOS Cloud VPS** |

Shared source of truth: [`packages/shared`](packages/shared) (brand tokens, menu, business config, media, domain schema).

## Quick start

```bash
# From repo root
npm install          # workspaces + runs sync
npm run sync         # copy shared → both apps
npm run sync:check   # parity gate

# Demo (Vercel-ready)
npm run dev:demo     # http://localhost:3000

# Laravel (Docker — host may not have PHP)
APP=apps/production-laravel
docker run --rm -v "$PWD/$APP":/app -w /app php:8.4-cli php artisan migrate --seed --force
docker run --rm -v "$PWD/$APP":/app -w /app php:8.4-cli php artisan serve --host=0.0.0.0 --port=8000
```

## Sync workflow (Next → Laravel)

1. Change product data/media/tokens in `packages/shared` (or demo UI in `apps/demo-next`).
2. Run `npm run sync`.
3. Port any React UI behaviour into Laravel Blade in the same change set.
4. `npm run sync:check` must pass (CI enforces this).

Auto-synced: CSS tokens, copy, business config, menu seed, domain enums, all media, sync version stamp.

## Features (both apps)

- Marketing site + GSAP bowl → salad → chicken hero
- Online ordering (cart, delivery/collection, track)
- Kitchen display, driver app, till POS, admin
- SumUp payments (simulation without API keys; live with `SUMUP_API_KEY` + `SUMUP_MERCHANT_CODE`)

## Deploy

### Vercel demo
- Root Directory: `apps/demo-next`
- Build: `npm run build`
- Optional env: `SUMUP_API_KEY`, `SUMUP_MERCHANT_CODE`, `NEXT_PUBLIC_APP_URL`

### IONOS production
See [`apps/production-laravel/deploy/README.md`](apps/production-laravel/deploy/README.md).

## Demo credentials

- Driver: `+447700900001` / `driver123` (Next demo)
- Seed track orders (Next): `FZ1001`, `FZ1002`

## Brand notes

Facebook page: https://www.facebook.com/franzoscoventry  
Official site was unavailable during build; menu/contact seeded from public listings. Replace media in `packages/shared/media` with client-approved assets, then `npm run sync`.
