[![Build](https://github.com/laststance/nsx/actions/workflows/build.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/build.yml)
[![Typecheck](https://github.com/laststance/nsx/actions/workflows/typecheck.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/typecheck.yml)
[![Test](https://github.com/laststance/nsx/actions/workflows/test.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/test.yml)
[![Lint](https://github.com/laststance/nsx/actions/workflows/lint.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/lint.yml)
[![Chromatic](https://github.com/laststance/nsx/actions/workflows/chromatic.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/chromatic.yml)
[![Playwright Admin Tests](https://github.com/laststance/nsx/actions/workflows/playwright_admin.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/playwright_admin.yml)
[![Playwright Selfhost Tests](https://github.com/laststance/nsx/actions/workflows/playwright_selfhost.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/playwright_selfhost.yml)
[![Playwright Visitor Tests](https://github.com/laststance/nsx/actions/workflows/playwright_visitor.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/playwright_visitor.yml)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/laststance/nsx)

> # Project Status: currently under development and scheduled for release in release 2028.
>
> The ultimate goal for this project is release it as a personal blog starter kit for React developers like Minimal Wordpress.  
> I'm developping essential feature while my spare time, currenty I planning release v1 2028.  
> All core feature implemented completely, I'm planning distribute repo source directly as similar as [Beam](https://github.com/planetscale/beam).
> [Roadmap](https://github.com/laststance/nsx/projects/1)

# NSX

<a src="https://nsx.malloc.tokyo/">
  <img src="https://digital3.nyc3.cdn.digitaloceanspaces.com/nsx.gif" />
</a>

⚛️ [Production](https://nsx.malloc.tokyo/) ✅ [Storybook](https://main--61c089c06b3b4d003adde63b.chromatic.com)

Auto post of web page list you read that day.

Used in combination with the [browser-extension](./browser-extension/) (included in this monorepo).

# Prerequisites

- Node.js v22.x.x (managed via Volta)
- pnpm

#### Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)

# Getting start local development

1. `git clone https://github.com/laststance/nsx.git`
1. `cd nsx`
1. `pnpm install`
1. `cp .env.sample .env`
1. `docker compose -f compose.yml -f compose.dev.yml up -d`
1. `pnpm db:reset`
1. `pnpm validate`
1. `pnpm server:start`
1. in other terminal screen `pnpm start`
1. `pnpm e2e:admin`
1. then, you confirmed local develop environment working fine.

open sidebar press `x` key
DB seeds initial user account is  
name: `John Doe`  
pass: `popcoon`

## Environment Variables

These are stored in `.env` and evaluated at build time.

| Variable Name               | Description                                                          | Required |
| --------------------------- | -------------------------------------------------------------------- | -------- |
| VITE_APP_TITLE              | Application title displayed in the UI                                | Yes      |
| VITE_APP_DESCRIPTION        | Application description for meta tags                                | Yes      |
| VITE_API_ENDPOINT           | Backend API endpoint URL                                             | Yes      |
| VITE_SENTRY_DSN             | Browser Sentry DSN for frontend error tracking                       | No       |
| VITE_SENTRY_DNS             | Deprecated typo kept for backward compatibility; use VITE_SENTRY_DSN | No       |
| VITE_SENTRY_RELEASE         | Browser Sentry release, usually the deployed Git SHA                 | No       |
| VITE_GA_MEASUREMENT_ID      | Google Analytics measurement ID (optional)                           | No       |
| ACCESS_TOKEN_SECRET         | Secret key for JWT token generation                                  | Yes      |
| DATABASE_URL                | MySQL database connection string                                     | Yes      |
| SENTRY_DSN                  | Backend Sentry DSN for Express error tracking                        | No       |
| SENTRY_RELEASE              | Backend Sentry release, usually the deployed Git SHA                 | No       |
| SENTRY_TRACES_SAMPLE_RATE   | Backend Sentry trace sample rate from 0 to 1                         | No       |
| LOG_LEVEL                   | JSON logger level (`debug`, `info`, `warn`, `error`)                 | No       |
| OPENAI_API_KEY              | OpenAI API key for translation features                              | No       |
| BLUESKY_USERNAME            | Bluesky account username for posting integration                     | No       |
| BLUESKY_PASSWORD            | Bluesky account password for posting integration                     | No       |
| MYSQL_ROOT_PASSWORD         | MySQL root password used by Docker Compose and backup jobs           | Yes      |
| BACKUP_GPG_RECIPIENT        | GPG public-key recipient for encrypted production backups            | Prod     |
| BACKUP_OFFSITE_RSYNC_TARGET | Offsite rsync target such as `backup@example.com:/srv/backups/nsx`   | Prod     |
| BACKUP_ALERT_WEBHOOK_URL    | Slack/Discord-compatible webhook called when backup fails            | Prod     |

## Observability

- Health check: `GET /api/health` returns `200` with DB status or `503` when MySQL is unreachable.
- Metrics: `GET /api/metrics` exposes Prometheus text metrics including Node.js defaults and HTTP request duration/counts.
- Logs: backend logs are JSON through pino and include `requestId`, route, status, and duration. PM2 still writes them to `logs/server-out.log` and `logs/server-error.log`.
- Sentry: set `SENTRY_DSN` for Express errors and `VITE_SENTRY_DSN` for browser errors. Set `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT` in GitHub Actions to upload Vite source maps during `pnpm build`.
- Uptime alerting: configure an external monitor such as UptimeRobot or Better Stack against `https://nsx.malloc.tokyo/api/health` with email/Slack/Discord alerts.
- PM2 resource alerting: use `pm2 monit`, `pm2 install pm2-server-monit`, or pm2.io, and keep `max_memory_restart: 512M` in `ecosystem.config.js` as the restart guard.

## API v1 Contract

Legacy `/api/*` endpoints are kept for the current SPA. New integrations should use the versioned `/api/v1/*` endpoints, which always return a response envelope:

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-05-27T00:00:00.000Z",
  "requestId": "request_123"
}
```

Errors use the same shape with `success: false`, `error`, and `code`, and never expose stack traces or raw internal exception messages. API metadata is available at `GET /api/v1/openapi.json`.

## Playwright

I'm using [Playwright](https://playwright.dev/) for E2E testing.  
Before run `pnpm playwright`, you need to run `pnpm build:e2e`.

## Production Server

- commands

```

pm2 start ecosystem.config.js    // Start Server with production mode
pm2 restart ecosystem.config.js  // Restart Server with production mode
pm2 stop 0                       // Stop server
pm2 ps -a                        // Show all processes

```

## Setup Procution Server

1. Setup Ubuntu server on [Digital Ocean](https://www.digitalocean.com/) or [Fly.io](https://fly.io/)
1. Update ubuntu with `apt upgrade`
1. see https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-22-04
1. `cd ~ && git clone https://github.com/laststance/nsx.git`
1. `cd nsx` and install [volta](https://volta.sh/)
1. `source ~/.bashrc` && `volta install node`
1. `pnpm`
1. install docker on Ubuntu https://docs.docker.com/engine/install/ubuntu/#set-up-the-repository
1. `docker compose -f compose.yml -f compose.prod.yml up -d` (MySQL has no host port; PM2 runtime uses `DATABASE_URL` with `socketPath`, and Prisma CLI normalizes it for migrations — see `.env.sample`)
1. pnpm db:migrate
1. touch .env.prod
1. npm i -g pm2
1. `touch .env && echo "ACCESS_TOKEN_SECRET=$(openssl rand -base64 60 | tr -d '\n' | cut -c1-60)" >> .env`
1. `pm2 start ecosystem.config.js`
1. Access from browser

## Deploy Flow

```
GitHub Repository (main branch)
       │
       │ Push / PR Merge
       ▼
GitHub Actions Workflow
       │
       │ 1. Checkout code
       │ 2. Setup Node.js & pnpm
       │ 3. Install dependencies
       │ 4. Build frontend (Vite) & backend (TypeScript)
       │ 5. pnpm deploy: Package server with backend-only deps
       ▼
   Build Artifacts
   (build/, server_build/, node_modules/, prisma/)
       │
       │ Upload via SCP
       ▼
DigitalOcean Server
       │
       │ 1. Create .env from secrets
       │ 2. Run Prisma migrations
       │ 3. PM2 restart (NO pnpm install needed!)
       ▼
Running Application (https://nsx.malloc.tokyo/)
```

> **Note**: Production server does NOT run `pnpm install`. All backend dependencies are pre-packaged in CI using `pnpm deploy`, reducing server load and deployment time.

## Adding Server Dependencies

When adding a new package that the server needs at runtime:

```bash
# 1. Add to root (for development)
pnpm add <package-name>

# 2. Also add to server workspace (for production deployment)
pnpm --filter=@nsx/server add <package-name>
```

**Why both?**

| Location              | Purpose     | When Used                              |
| --------------------- | ----------- | -------------------------------------- |
| `package.json` (root) | Development | Running `nodemon` locally              |
| `server/package.json` | Production  | `pnpm deploy` packages only these deps |

> 💡 **pnpm workspace behavior**: Individual packages don't have their own `node_modules`. All packages share the root `node_modules`. Only `pnpm deploy` creates an isolated `node_modules` for production deployment.

**Frontend-only packages** (React, UI libraries, etc.):

- Add to root `package.json` only
- No need to add to `server/package.json`

## Utility Scripts

NSX includes several utility scripts in the `scripts/` directory to help with common development and deployment tasks:

### Deploy Script

```bash
# Deploy both frontend and backend to production
./scripts/deploy

# Deploy only backend
./scripts/deploy -s

# Deploy only frontend
./scripts/deploy -f
```

The deploy script uses rsync to upload build artifacts to the production server.

### Database Backup

```bash
# Create, verify, encrypt, rotate, and offsite-sync a production backup
./scripts/backup

# Install the daily 03:00 cron entry on the production server
./scripts/install-backup-cron
```

The backup job is designed to run on the production server. It dumps MySQL from the Docker container, restores the dump into a temporary verification database, encrypts the verified dump with GPG, keeps 7 daily / 4 weekly / 3 monthly backups, syncs encrypted backups to `BACKUP_OFFSITE_RSYNC_TARGET`, and sends `BACKUP_ALERT_WEBHOOK_URL` on failure.

Required production backup settings:

```bash
MYSQL_ROOT_PASSWORD=...
BACKUP_GPG_RECIPIENT=backup@nsx
BACKUP_OFFSITE_RSYNC_TARGET=backup@example.com:/srv/backups/nsx

# Optional: needed only when failure/success webhook alerts are desired.
# BACKUP_ALERT_WEBHOOK_URL=https://hooks.slack.com/services/...
```

### Database Restore

```bash
# Restore a database from a plain, gzipped, or encrypted backup file
./scripts/restore backups/daily/nsx-daily-20260527T030000+0900.sql.gz.gpg
```

The restore script decrypts/decompresses locally when needed, then streams SQL into the production MySQL Docker container over SSH. Set `RESTORE_SSH_TARGET` explicitly before every restore so the target host is never guessed.

### Code Validation

```bash
# Run all validation checks at once
./scripts/validate
```

The validate script runs tests, linting, type checking, and build in parallel to ensure code quality.

### SSL Certificate Renewal Hooks

Express binds port 80 (HTTP→HTTPS redirect) and 443 (HTTPS) and loads the Let's Encrypt cert at startup with `fs.readFileSync` (see `server/index.ts`). Because certbot uses the `standalone` authenticator, it also needs port 80 for the ACME challenge — so PM2 must stop before each renewal and start after. The repo ships `pre`/`post` hook scripts that automate this:

```
scripts/letsencrypt-hooks/
├── pre/stop-pm2.sh    # certbot pre-hook: pm2 stop server (frees port 80)
└── post/start-pm2.sh  # certbot post-hook: pm2 start server (always runs, even on renewal failure)
```

**Deploy to a fresh production server (run once):**

```bash
scp scripts/letsencrypt-hooks/pre/stop-pm2.sh \
    scripts/letsencrypt-hooks/post/start-pm2.sh \
    nsx.malloc.tokyo:/tmp/

ssh nsx.malloc.tokyo 'sudo mv /tmp/stop-pm2.sh /etc/letsencrypt/renewal-hooks/pre/ && \
  sudo mv /tmp/start-pm2.sh /etc/letsencrypt/renewal-hooks/post/ && \
  sudo chown root:root /etc/letsencrypt/renewal-hooks/{pre/stop-pm2.sh,post/start-pm2.sh} && \
  sudo chmod 755 /etc/letsencrypt/renewal-hooks/{pre/stop-pm2.sh,post/start-pm2.sh} && \
  sudo certbot renew --dry-run'
```

The final `--dry-run` exercises the full loop (pre → simulated renewal → post) without consuming a Let's Encrypt rate-limit slot.

**Manual renewal (recovery, if hooks are missing):**

```bash
ssh nsx.malloc.tokyo 'pm2 stop server'
ssh nsx.malloc.tokyo 'sudo certbot renew --non-interactive'
ssh nsx.malloc.tokyo 'pm2 start server'
```

> **Note**: `pnpm deploy` only rsyncs `build/`, `server_build/`, and `ecosystem.config.js`. It does NOT update `/etc/letsencrypt/renewal-hooks/`. Re-run the deploy step above if the hook scripts change.
