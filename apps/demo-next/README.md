# Franzos Coventry — Next.js demo

Vercel-ready demo storefront with SmashDaddy-parity routes: menu, checkout, tracking, kitchen (KDS), driver, till, and admin.

## Data

Shared JSON is synced from `packages/shared` into `src/data/`:

- `menu.seed.json`, `business.json`, `copy.json`, `domain.json`
- Brand tokens: `src/styles/tokens.css`

From the monorepo root:

```bash
npm run sync
```

(If Laravel paths are not writable, copy shared files into `src/data/` manually as in postinstall.)

## Orders store

Demo orders use a module singleton plus persistence to `.data/orders.json` (no Postgres required). Two seed orders ship on first run.

## Run locally

```bash
# from monorepo root
npm run dev:demo

# or
cd apps/demo-next && npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build:demo
```

## SumUp

Without `SUMUP_API_KEY`, `/api/payments/sumup` and checkout run in **simulation mode** (payments marked `COMPLETED`).

## Demo logins

| Role   | Phone           | Password   |
|--------|-----------------|------------|
| Driver | +447700900001   | driver123  |

## Routes

`/`, `/menu`, `/order`, `/track`, `/about`, `/contact`, `/opening-hours`, `/kitchen`, `/driver`, `/driver/login`, `/till`, `/admin`
