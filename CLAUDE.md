# CLAUDE.md

💡 Must Read PROJECT_INDEX.md at session start for instant context instead of exploring the codebase.

## Rules

- Never remove browser-extension from pnpm workspace.
- Node.js version: 22.20.0 (managed via Volta)

## Development Commands

### Quick Start

```bash
cp .env.sample .env
docker-compose up -d
pnpm install
pnpm db:reset
pnpm server:start    # Terminal 1: Backend on port 4000
pnpm start           # Terminal 2: Frontend on port 3010
```

Default login: `John Doe` / `popcoon`

### Frontend

- `pnpm start` - Dev server (port 3010)
- `pnpm build` - Production build
- `pnpm build:e2e` - E2E test build

### Backend

- `pnpm server:start` - Start with nodemon (port 4000)
- `pnpm server:build` - Build to server_build/

### Testing

```bash
# Unit tests
pnpm test                    # Run all unit tests
pnpm test -- path/to/file    # Run single test file

# E2E tests (requires pnpm build:e2e first)
pnpm playwright              # Run all E2E tests
pnpm playwright:ui           # Interactive UI mode
pnpm playwright -- --grep "test name"  # Run specific test
```

### Quality Checks

- `pnpm lint` - ESLint
- `pnpm typecheck` - TypeScript checks
- `pnpm validate` - All checks in parallel (tests, lint, typecheck, build)

### Database

- `pnpm db:reset` - Reset with migrations and seed
- `pnpm db:migrate:dev` - Run migrations
- `pnpm prisma generate` - Regenerate client after schema changes
- `pnpm prisma studio` - Database GUI

## Architecture Overview

NSX is a personal blog/reading tracker with auto-posting from browser extension.

### Tech Stack

- **Frontend**: React 19 + Vite + Redux Toolkit (RTK Query) + TailwindCSS
- **Backend**: Express 5 + Prisma + MySQL
- **Testing**: Vitest (unit) + Playwright (E2E) + Storybook
- **Deployment**: PM2 + Docker + HTTPS

### Project Structure

```
/src              # React frontend
  /redux          # State management (RTK Query API + slices)
  /pages          # Route components
  /components     # Reusable UI components
  /router         # AuthRouter for protected routes
/server           # Express backend
  /routes         # API route handlers (post, user, stock, tweet, bluesky, translate)
/@types           # Shared TypeScript definitions (Req.*, Res.*, domain types)
/prisma           # Database schema and migrations
/e2e              # Playwright E2E tests
/browser-extension # WXT-based Chrome extension (separate workspace package)
```

### Key Architectural Patterns

#### API Layer

RTK Query handles all API calls with auto-caching and invalidation. Defined in `src/redux/API.ts`:

- Tag-based cache invalidation (`Posts`, `Tweets`)
- Auto-generated hooks: `useFetchPostListQuery`, `useCreatePostMutation`, etc.
- 401 responses trigger automatic logout and redirect

#### Routing

React Router v7 with protected dashboard routes:

```
/                    # Public index
/post/:postId        # Public post view
/login               # Authentication
/dashboard           # Protected (AuthRouter)
  /create            # Create post
  /edit/:postId      # Edit post
  /tweet             # Tweet management
  /settings/*        # User settings
```

#### Type Sharing

Global types in `/@types/` are auto-available (no imports needed):

- `User`, `Post`, `Stock` - Domain models
- `Req.Login`, `Req.CreatePost` - Request payloads
- `Res.PostList`, `Res.Login` - Response shapes

#### Backend Routes

Express routes in `/server/routes/`:

- `post.ts` - CRUD for posts, handles stock conversion
- `user.ts` - Auth (login/signup/logout), profile, user count
- `stock.ts` - Browser extension saves here
- `tweet.ts` - Tweet management with Bluesky posting
- `translate.ts` - OpenAI translation
- `bluesky.ts` - Bluesky social posting

### Dual-Server Development

Frontend (Vite) proxies `/api/*` to backend (Express):

- Frontend: http://localhost:3010
- Backend: http://localhost:4000
- API calls use `VITE_API_ENDPOINT` environment variable

### Browser Extension

Located in `/browser-extension/` as a pnpm workspace package:

- Framework: WXT (Manifest V3)
- Captures web pages and posts to `/api/posts` endpoint
- Run `cd browser-extension && pnpm dev` for extension development
- See `browser-extension/README.md` for details

### Database Models (Prisma)

- `User` (authors table) - Auth users with settings
- `Post` (posts table) - Blog posts
- `Stock` (stocks table) - Captured pages from extension
- `tweet` - Tweet storage with attachments

### Environment Variables

Required in `.env`:

| Variable               | Description      |
| ---------------------- | ---------------- |
| `VITE_API_ENDPOINT`    | Backend API URL  |
| `VITE_APP_TITLE`       | App title        |
| `VITE_APP_DESCRIPTION` | App description  |
| `ACCESS_TOKEN_SECRET`  | JWT secret       |
| `DATABASE_URL`         | MySQL connection |

Optional:

| Variable                                | Description          |
| --------------------------------------- | -------------------- |
| `OPENAI_API_KEY`                        | Translation features |
| `BLUESKY_USERNAME` / `BLUESKY_PASSWORD` | Social posting       |
| `VITE_SENTRY_DNS`                       | Error tracking       |
| `VITE_GA_MEASUREMENT_ID`                | Analytics            |

### Production

```bash
pm2 start ecosystem.config.js    # Start
pm2 restart ecosystem.config.js  # Restart
pm2 stop 0                       # Stop
```

Deploy scripts in `/scripts/`:

- `./scripts/deploy` - Deploy to production
- `./scripts/backup` - Database backup
- `./scripts/restore backup.sql` - Database restore
