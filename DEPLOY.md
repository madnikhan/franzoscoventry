# Deployment guide

## Demo — Vercel (Next.js)

1. Push this monorepo to GitHub.
2. In Vercel → New Project → import repo.
3. **Root Directory:** `apps/demo-next`
4. Framework preset: Next.js
5. Environment variables (optional for simulation mode):
   - `NEXT_PUBLIC_APP_URL` = `https://your-demo.vercel.app`
   - `SUMUP_API_KEY` / `SUMUP_MERCHANT_CODE` for live SumUp sandbox
6. Deploy. Preview URLs work per PR.

Before first deploy, run locally: `npm run sync` so `src/data` and `public/media` are populated.

## Production — IONOS Cloud VPS (Laravel)

Full steps: [`apps/production-laravel/deploy/README.md`](apps/production-laravel/deploy/README.md)

Summary:
- Ubuntu VPS, Nginx → `public/`, PHP 8.4-FPM, PostgreSQL, Redis, Supervisor, Certbot
- Env from `apps/production-laravel/deploy/.env.ionos.example`
- Always run `npm run sync` in the monorepo before packaging Laravel for release so seeds/tokens/media match the demo

## SumUp

| Environment | Keys |
|-------------|------|
| Vercel demo | Sandbox / omit for simulation |
| IONOS production | Live merchant keys + webhook `https://your-domain/webhooks/sumup` |
