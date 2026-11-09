# IONOS Cloud VPS deployment — Franzos Laravel

## Requirements
- Ubuntu 24.04+ VPS with SSH
- Nginx, PHP 8.4-FPM (+ pdo_pgsql, redis, mbstring, xml, curl, zip, bcmath, gd)
- PostgreSQL 16, Redis, Composer, Node 20+ (build assets on CI or server)
- Supervisor, Certbot

## Steps
1. Point DNS A/AAAA records to the VPS.
2. Clone monorepo; use `apps/production-laravel` as the app root (or deploy only that folder after `npm run sync` from monorepo root).
3. Copy `deploy/.env.ionos.example` → `.env`, set `APP_KEY` (`php artisan key:generate`), DB, SumUp, Redis.
4. `composer install --no-dev -o`
5. `npm ci && npm run build` (or build in CI and upload `public/build`)
6. `php artisan migrate --force && php artisan db:seed --force`
7. `php artisan storage:link`
8. Install Nginx site from `deploy/nginx.conf` (adjust paths/domain).
9. Install Supervisor programs from `deploy/supervisor.conf` (`queue:work`, optional `reverb:start`).
10. Cron: `* * * * * www-data cd /var/www/franzos && php artisan schedule:run`
11. `certbot --nginx -d your-domain.example`

Document root **must** be `public/`.
