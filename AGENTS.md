# NSX

Auto post of web page list you read that day.
Production: https://nsx.malloc.tokyo/
Repo: https://github.com/laststance/nsx

## Tech Stack

| Layer    | Technology                                              |
| -------- | ------------------------------------------------------- |
| Frontend | React 19, Redux Toolkit, React Router 7, Tailwind CSS 4 |
| Backend  | Express 5, Prisma 7 (MySQL 8.1)                         |
| Build    | Vite 8 (Rolldown), esbuild (server)                     |
| Test     | Vitest, Playwright, Storybook 9, MSW 2                  |
| Language | TypeScript 6 (strict), pnpm 12                          |
| Infra    | pm2, Docker Compose, Let's Encrypt                      |

## Commands

```bash
# Development
pnpm dev              # Vite dev server
pnpm server:start     # Express dev server (nodemon, port 4000)

# Quality
pnpm typecheck        # tsc --noEmit
pnpm lint             # ESLint (max-warnings=0)
pnpm test             # Vitest unit tests
pnpm playwright       # Playwright E2E tests
pnpm storybook        # Storybook dev (port 6006)

# Build
pnpm build            # Frontend production build
pnpm server:build     # esbuild Express → server_build/server/index.js

# Deploy: push to main → GitHub Actions (deploy.yml). Local manual deploy is retired:
# `pnpm build` needs `.env.prod`, which only CI generates from GitHub secrets.
pnpm deploy -- -s     # (emergency) rsync a locally built server_build only
```

## Architecture

```
nsx/
├── src/              # React frontend (SPA)
├── server/           # Express API server
│   ├── index.ts      # Entry point (HTTPS:443 in prod, HTTP:4000 in dev)
│   ├── api.ts        # Router aggregator
│   ├── routes/       # API route handlers (post, user, stock, tweet, bluesky, translate)
│   ├── prisma.ts     # Prisma client instance
│   ├── auth.ts       # JWT authentication
│   ├── cron.ts       # Scheduled tasks
│   └── lib/          # Utilities (JWT, Logger)
├── prisma/
│   └── schema.prisma # DB schema (models: User→authors, Post→posts, Stock→stocks, tweet, attachment)
├── e2e/              # Playwright E2E tests
├── mocks/            # MSW mock handlers
├── compose.yml       # MySQL Compose base (no host ports)
├── compose.dev.yml   # Dev overlay: 3306 + ./data/mysql
├── compose.prod.yml  # Prod overlay: named volume + Unix socket dir
└── ecosystem.config.js # pm2 config
```

### API Routes

All routes are mounted under `/api`:

| Method | Path                            | Description                 |
| ------ | ------------------------------- | --------------------------- |
| GET    | `/api/post_list?page=&perPage=` | Paginated post list         |
| GET    | `/api/post/:id`                 | Single post                 |
| POST   | `/api/create`                   | Create post (auth required) |
| POST   | `/api/update`                   | Update post (auth required) |
| DELETE | `/api/post/:id`                 | Delete post (auth required) |

## Production Environment

- **Server**: Ubuntu (`ssh nsx.malloc.tokyo`)
- **Deploy path**: `/home/deploy/nsx/`
- **DB**: MySQL 8.1 via `docker compose -f compose.yml -f compose.prod.yml`; named volume `nsx_mysql_data`; host PM2 uses `DATABASE_URL` with `socketPath` to `./run/mysqld/mysqld.sock` (see `.env.sample`)
- **Express**: pm2 → `server_build/server/index.js`, HTTPS port 443
- **Shell**: fish (heredoc 非対応 — use `bash -c` or scp for multi-line writes)
- **DB Backups**: Local at `~/repository/backup-files/nsx/backup_YYYYMMDD.sql`

### Deploy Flow

```
push to main → deploy.yml: build → tar artifact → scp → write server .env from GitHub secrets → prisma migrate deploy → rsync → pm2 reload
```

### Production Secrets

- **GitHub secrets are the only copy.** Nobody keeps production credentials locally (no `.env.prod`, no password manager). Local `.env` and the tracked `.env.e2e` / `.env.test` / `.env.storybook` hold dev/test dummies only.
- Every deploy rewrites these keys in the server `.env`: `DATABASE_URL` (built from `MYSQL_ROOT_PASSWORD`), `MYSQL_ROOT_PASSWORD`, `MYSQL_USER`, `MYSQL_PASSWORD`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `OPENAI_API_KEY`, `BLUESKY_USERNAME`, `BLUESKY_PASSWORD`. Hand edits to those lines on the server are overwritten.
- **Rotate**: pipe a new value straight into `gh secret set <NAME> -R laststance/nsx` (never echo it), then redeploy. For MySQL passwords the deploy runs `ALTER USER` with the old root password from the server `.env`, because MySQL ignores `MYSQL_*` env after first init.
- DB secrets must match `[A-Za-z0-9._~-]+` (they go into SQL and the URL); other secrets must not contain `"`, `\` or newlines.

### DB Recovery

```bash
# 1. Copy backup to server
scp ~/repository/backup-files/nsx/backup_YYYYMMDD.sql nsx.malloc.tokyo:/tmp/

# 2. Import (SSH to server, then from /home/deploy/nsx):
#    set -a && source .env && set +a
#    docker compose -f compose.yml -f compose.prod.yml exec -T db \
#      mysql -uroot -p"$MYSQL_ROOT_PASSWORD" digital < /tmp/backup_YYYYMMDD.sql

# 3. Restart Express
ssh nsx.malloc.tokyo 'pm2 restart server'

# 4. Verify
curl -sk 'https://nsx.malloc.tokyo/api/post_list?page=1&perPage=5'
```

### SSL Certificate Renewal

Express loads the Let's Encrypt cert with `fs.readFileSync` at startup (server/index.ts:102-113), and Express itself binds port 80 for the HTTP→HTTPS redirect. certbot uses `authenticator = standalone`, which also needs port 80, so PM2 must stop before each renewal and start after. Repo-tracked hook scripts handle this automatically — they live at `scripts/letsencrypt-hooks/{pre,post}/` and must be deployed once to `/etc/letsencrypt/renewal-hooks/{pre,post}/` on the server.

**Initial setup (run once per server):**

```bash
scp scripts/letsencrypt-hooks/pre/stop-pm2.sh \
    scripts/letsencrypt-hooks/post/start-pm2.sh nsx.malloc.tokyo:/tmp/
ssh nsx.malloc.tokyo 'sudo mv /tmp/stop-pm2.sh /etc/letsencrypt/renewal-hooks/pre/ && \
  sudo mv /tmp/start-pm2.sh /etc/letsencrypt/renewal-hooks/post/ && \
  sudo chown root:root /etc/letsencrypt/renewal-hooks/pre/stop-pm2.sh /etc/letsencrypt/renewal-hooks/post/start-pm2.sh && \
  sudo chmod 755 /etc/letsencrypt/renewal-hooks/pre/stop-pm2.sh /etc/letsencrypt/renewal-hooks/post/start-pm2.sh && \
  sudo certbot renew --dry-run'
```

**Manual renewal (if hooks are missing):**

```bash
ssh nsx.malloc.tokyo 'pm2 stop server'
ssh nsx.malloc.tokyo 'sudo certbot renew --non-interactive'
ssh nsx.malloc.tokyo 'pm2 start server'
```

**Verify after renewal:**

```bash
echo | openssl s_client -servername nsx.malloc.tokyo -connect nsx.malloc.tokyo:443 2>/dev/null \
  | openssl x509 -noout -dates
curl -sI https://nsx.malloc.tokyo | head -1   # expect HTTP/1.1 200 OK
curl -sI http://nsx.malloc.tokyo | head -1    # expect HTTP/1.1 301 Moved Permanently
```

## Known Issues / Gotchas

- **`@chromatic-com/storybook` v5**: Incompatible with Storybook 9. Dependabot repeatedly bumps to v5 — must pin to `^4.1.3` until Storybook 10 upgrade.
- **Express 5 params type**: `req.params.x` is `string | string[]`. Wrap with `String()` when passing to functions expecting `string`.
- **Vite 8 manualChunks**: Only function form supported (not object form). See Rolldown migration.
- **Compose**: Local uses `compose.yml` + `compose.dev.yml` (bind mount under `./data/mysql`). Production uses `compose.yml` + `compose.prod.yml` (volume `nsx_mysql_data`, Unix socket under `./run/mysqld/`).
- **Deploy clean step**: GitHub Actions must not `rm -rf` the top-level `run/` tree; recreating it changes inode while the running `db` container still bind-mounts the old path, breaking `socketPath` until `docker compose` recreates the DB service.
- **dotenv path**: In production, `.env` is at `/home/deploy/nsx/.env` (2 levels up from server_build/server/index.js).
- **SSL renewal hook deployment**: certbot renewal hooks live on the server only; deploying repo updates (GitHub Actions or `pnpm deploy`) does NOT update `/etc/letsencrypt/renewal-hooks/`. Re-run the SSL initial setup if you change the scripts.

## GBrain Configuration (configured by /setup-gbrain)

- Mode: local-stdio
- Engine: pglite
- Config file: ~/.gbrain/config.json (mode 0600)
- Setup date: 2026-11-01
- MCP registered: yes (user scope)
- Artifacts sync: full
- Current repo policy: read-write
- Repo code: NOT imported (decided 2026-11-01). The brain is empty, so use Grep / Serena for code questions. Only an explicit `/sync-gbrain` sends NSX code to gbrain (OpenAI embeddings).
- Skills dir: pinned to `~/.gbrain/skills` via `GBRAIN_SKILLS_DIR` in `~/.gbrain/.env`, so gbrain never auto-detects `~/.openclaw/workspace`
