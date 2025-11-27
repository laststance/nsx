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
1. `docker-compose up -d`
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

| Variable Name          | Description                                      | Required |
| ---------------------- | ------------------------------------------------ | -------- |
| VITE_APP_TITLE         | Application title displayed in the UI            | Yes      |
| VITE_APP_DESCRIPTION   | Application description for meta tags            | Yes      |
| VITE_API_ENDPOINT      | Backend API endpoint URL                         | Yes      |
| VITE_SENTRY_DNS        | Sentry DSN for error tracking (optional)         | No       |
| VITE_GA_MEASUREMENT_ID | Google Analytics measurement ID (optional)       | No       |
| ACCESS_TOKEN_SECRET    | Secret key for JWT token generation              | Yes      |
| DATABASE_URL           | MySQL database connection string                 | Yes      |
| OPENAI_API_KEY         | OpenAI API key for translation features          | No       |
| BLUESKY_USERNAME       | Bluesky account username for posting integration | No       |
| BLUESKY_PASSWORD       | Bluesky account password for posting integration | No       |

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
1. docker compose up -d
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
# Create a database backup and download it to your local machine
./scripts/backup
```

This script connects to the production server, creates a MySQL database dump from the Docker container, and downloads it to your local machine.

### Database Restore

```bash
# Restore a database from a backup file
./scripts/restore backup_20240101.sql
```

This script uploads a local backup file to the production server and restores the database from it.

### Code Validation

```bash
# Run all validation checks at once
./scripts/validate
```

The validate script runs tests, linting, type checking, and build in parallel to ensure code quality.
