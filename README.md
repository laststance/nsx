[![Build](https://github.com/laststance/nsx/actions/workflows/build.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/build.yml)
[![Typecheck](https://github.com/laststance/nsx/actions/workflows/typecheck.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/typecheck.yml)
[![Test](https://github.com/laststance/nsx/actions/workflows/test.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/test.yml)
[![Lint](https://github.com/laststance/nsx/actions/workflows/lint.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/lint.yml)
[![Chromatic](https://github.com/laststance/nsx/actions/workflows/chromatic.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/chromatic.yml)
[![Playwright Admin Tests](https://github.com/laststance/nsx/actions/workflows/playwright_admin.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/playwright_admin.yml)
[![Playwright Selfhost Tests](https://github.com/laststance/nsx/actions/workflows/playwright_selfhost.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/playwright_selfhost.yml)
[![Playwright Visitor Tests](https://github.com/laststance/nsx/actions/workflows/playwright_visitor.yml/badge.svg)](https://github.com/laststance/nsx/actions/workflows/playwright_visitor.yml)

> # Project Status: currently under development and scheduled for release in release 2026.
>
> The ultimate goal for this project is release it as a personal blog starter kit for React developers like Minimal Wordpress.  
> I'm developping essential feature while my spare time, currenty I planning release v1 2026.  
> All core feature implemented completely, I'm planning distribute repo source directly as similar as [Beam](https://github.com/planetscale/beam).
> [Roadmap](https://github.com/laststance/nsx/projects/1)

# NSX

<a src="https://nsx.malloc.tokyo/">
  <img src="https://digital3.nyc3.cdn.digitaloceanspaces.com/nsx.gif" />
</a>

⚛️ [Production](https://nsx.malloc.tokyo/) ✅ [Storybook](https://main--61c089c06b3b4d003adde63b.chromatic.com)

Auto post of web page list you read that day.

Used in combination with [nsx-browser-extension](https://github.com/laststance/nsx-browser-extension).

# Prerequisites

- Node.js v18.x.x
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

## Enviroment Variables

These are storing `.env` and evaluate at build time.

| Variable Name         | Role                | other |
| --------------------- | ------------------- | ----- |
| VITE_APP_TITLE        | title               |       |
| VITE_APP_DESCRIPTION  | desc                |       |
| VITE_API_ENDPOINT     | end                 |       |
| VITE_SENTRY_DNS       | sentry              |       |
| VITE_GA_TRACKING_CODE | ga                  |       |
| JWT_SECRET            | server auth         |       |
| DB_URL                | Database            |       |
| BROWSER               | open via dev server |       |

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
1. `touch .env && echo "JWT_SECRET=$(openssl rand -base64 60 | tr -d '\n' | cut -c1-60)" >> .env`
1. `pm2 start ecosystem.config.js`
1. Access from browser
