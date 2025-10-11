# NSX - React + Express Full-Stack Application

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

NSX is a React 19 + Express full-stack web application for auto-posting web pages that users read daily. It uses React + Vite + Redux Toolkit + TailwindCSS for the frontend and Express + Prisma + MySQL for the backend, with comprehensive testing via Vitest (unit) + Playwright (E2E) + Storybook.

## Working Effectively

### Bootstrap and Setup (First Time)

Execute these commands in sequence to set up a fresh development environment:

1. **Install dependencies**: `pnpm install`
   - Takes ~20 seconds. Set timeout to 60+ seconds minimum.
   - This will automatically run `pnpm prisma generate` via postinstall hook.

2. **Environment setup**: `cp .env.sample .env`
   - Creates local environment file with development defaults.

3. **Start database**: `docker compose up -d`
   - Starts MySQL 8.1 database in Docker container.
   - First run takes ~30 seconds (image download). Set timeout to 120+ seconds.
   - Subsequent runs take ~5 seconds.

4. **Setup database schema**: `pnpm db:reset`
   - Runs migrations and seeds the database.
   - Takes ~5 seconds. Set timeout to 30+ seconds.

### Build Commands

All build commands are fast and work reliably:

- **Frontend build**: `pnpm build`
  - Takes ~8 seconds. Set timeout to 30+ seconds.
  - Builds production frontend to `/build` directory.

- **Backend build**: `pnpm server:build`
  - Takes ~3 seconds. Set timeout to 30+ seconds.
  - Compiles TypeScript backend to `/server_build` directory.

- **E2E build**: `pnpm build:e2e`
  - Takes ~8 seconds. Set timeout to 30+ seconds.
  - **REQUIRED before running Playwright tests**.

### Testing Commands

- **Unit tests**: `pnpm test`
  - Takes ~20 seconds. Set timeout to 60+ seconds.
  - Uses Vitest with React Testing Library.
  - **NOTE**: One existing timezone-related test failure in `formatDate.test.ts` - ignore this.

- **Linting**: `pnpm lint`
  - Takes ~25 seconds. Set timeout to 60+ seconds.
  - Uses ESLint with React and accessibility rules.

- **Type checking**: `pnpm typecheck`
  - Takes ~8 seconds. Set timeout to 30+ seconds.
  - Runs TypeScript compiler with --noEmit.

- **Full validation**: `pnpm validate`
  - Runs test, lint, typecheck, and build in parallel.
  - Takes ~40 seconds. Set timeout to 120+ seconds.
  - May fail due to existing test failure - this is acceptable.

- **E2E tests**: `pnpm playwright`
  - **MUST run `pnpm build:e2e` first**.
  - Takes ~15 seconds for basic tests. Set timeout to 60+ seconds.
  - **CRITICAL**: Stops any running dev servers before executing.

### Development Servers

NSX uses a dual-server development setup:

1. **Backend server**: `pnpm server:start`
   - Starts Express server with nodemon on **port 4000**.
   - Hot reloads on server file changes.
   - Handles API routes and serves static files in production.

2. **Frontend server**: `pnpm start`
   - Starts Vite dev server on **port 3010**.
   - Proxies API calls to backend on port 4000.
   - Hot reloads on frontend file changes.

**ALWAYS run both servers simultaneously for development**.

### Storybook

- **Start**: `pnpm storybook`
  - Starts Storybook dev server on **port 6006**.
  - Takes ~5 seconds to start.

- **Build**: `pnpm build-storybook`
  - Builds static Storybook for deployment.

## Validation Scenarios

### CRITICAL: Manual Validation Requirements

After making changes, ALWAYS run through these validation steps:

1. **Basic Application Flow**:
   - Navigate to `http://localhost:3010` in browser
   - Verify homepage loads with "NSX" title and navigation
   - Test theme toggle button (light/dark mode)
   - Navigate to `/about` page and verify content loads

2. **API Functionality**:
   - Ensure backend server is running on port 4000
   - API endpoints are available at `http://localhost:3010/api/` (proxied by Vite)

3. **Authentication Flow** (when working on auth features):
   - Use test credentials from E2E tests: username "John Doe", password "popcoon"
   - Test login, logout, and protected routes

4. **Build Verification**:
   - ALWAYS run `pnpm build && pnpm server:build` before finalizing changes
   - Verify both builds complete without errors

5. **Test Coverage**:
   - Run `pnpm test` and verify your changes don't break existing tests
   - Run `pnpm lint` to ensure code style compliance

### Database Operations

- **Reset with seed**: `pnpm db:reset` (use for development)
- **Migration only**: `pnpm db:migrate:dev` (for schema changes)
- **Prisma Studio**: `pnpm prisma studio` (database GUI on port 5555)
- **Regenerate client**: `pnpm prisma generate` (after schema changes)

## Common Tasks

### File Structure (Key Locations)

```
/src                 # React frontend application
  /components        # Reusable UI components with Storybook stories
  /pages            # Route components (Index, Login, Dashboard, etc.)
  /lib              # Utility functions and helpers
/server             # Express backend application
  /routes           # API route handlers
  /lib              # Server utilities (JWT, validation, etc.)
/e2e                # Playwright end-to-end tests
/prisma             # Database schema and migrations
/.storybook         # Storybook configuration
/scripts            # Utility scripts (deploy, validate, etc.)
```

### Key Configuration Files

- `package.json` - Scripts and dependencies (uses pnpm)
- `vite.config.ts` - Frontend build configuration
- `server/tsconfig.json` - Backend TypeScript configuration
- `playwright.config.ts` - E2E test configuration
- `prisma/schema.prisma` - Database schema
- `compose.yml` - Docker MySQL database
- `.env` - Environment variables (copy from `.env.sample`)

### Environment Variables

All frontend env vars are prefixed with `VITE_`:

- `VITE_API_ENDPOINT=http://localhost:3010/api/` (dev proxy)
- `VITE_APP_TITLE="NSX"`
- `ACCESS_TOKEN_SECRET` (JWT secret, backend only)
- `DATABASE_URL` (MySQL connection string)

### Production Deployment

- Uses PM2 for process management
- Frontend builds to `/build`, backend to `/server_build`
- Single server serves both static files and API
- GitHub Actions handles CI/CD pipeline

## Troubleshooting

### Common Issues

- **"Port already in use"**: Stop existing dev servers with Ctrl+C
- **Database connection error**: Ensure `docker compose up -d` completed
- **Playwright fails**: Run `pnpm build:e2e` first and stop dev servers
- **Missing dependencies**: Run `pnpm install` again
- **Build errors**: Check TypeScript types with `pnpm typecheck`

### Recovery Commands

- **Clean restart**: `pnpm clean && pnpm install`
- **Database reset**: `pnpm db:reset`
- **Kill processes**: Use system tools to kill processes on ports 3010/4000/6006

## Node.js and Dependencies

### Requirements

- **Node.js v20+** (tested on v20.19.4, project specifies v22.17.1 in volta config)
- **pnpm** package manager (install with `npm install -g pnpm`)
- **Docker** for MySQL database

### Installation Validation

Run these commands to verify environment:

```bash
node --version  # Should be v20+
pnpm --version  # Should be v10+
docker --version  # Should be available
```

### Browser Extension Integration

NSX works with a companion browser extension ([nsx-browser-extension](https://github.com/laststance/nsx-browser-extension)) to automatically capture web pages users visit.

## Performance Notes

- Frontend build: ~8 seconds
- Backend build: ~3 seconds
- Unit tests: ~20 seconds
- E2E tests: ~15 seconds
- Full validation: ~40 seconds
- All build times are reasonable for iterative development

**REMEMBER**: Always validate functionality manually by running the application and testing user scenarios after making changes.
