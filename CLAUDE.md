# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Frontend Development

- `pnpm start` - Start development server (frontend on port 3010)
- `pnpm build` - Build production frontend
- `pnpm build:e2e` - Build for E2E testing environment
- `pnpm preview` - Preview production build

### Backend Development

- `pnpm server:start` - Start backend server with nodemon (port 4000)
- `pnpm server:build` - Build TypeScript backend to server_build/

### Testing & Quality

- `pnpm test` - Run unit tests with Vitest
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript compiler checks
- `pnpm validate` - Run all validation checks (tests, lint, typecheck, build) in parallel
- `pnpm playwright` - Run E2E tests (requires `pnpm build:e2e` first)
- `pnpm playwright:ui` - Run Playwright tests with UI

### Database

- `pnpm db:reset` - Reset database with migrations and seed
- `pnpm db:migrate:dev` - Run migrations in development
- `pnpm db:migrate:deploy` - Run migrations in production
- `pnpm prisma generate` - Regenerate Prisma client after schema changes
- `pnpm prisma studio` - Open Prisma Studio for database GUI

### Storybook

- `pnpm storybook` - Start Storybook development server
- `pnpm build-storybook` - Build Storybook for production

## Architecture Overview

### Full-Stack Structure

NSX is a React + Express application for auto-posting web pages read daily. The project uses:

- **Frontend**: React 19 + Vite + Redux Toolkit + TailwindCSS
- **Backend**: Express + Prisma + MySQL
- **Testing**: Vitest (unit) + Playwright (E2E) + Storybook
- **Production**: PM2 + Docker + HTTPS

### Key Architectural Patterns

#### Monorepo Structure

- `/src` - React frontend application
- `/server` - Express backend API
- `/e2e` - Playwright end-to-end tests
- `/@types` - Shared TypeScript definitions
- `/prisma` - Database schema and migrations

#### Frontend Architecture

- **State Management**: Redux Toolkit with RTK Query for API calls
- **Routing**: React Router v7 with nested routes under `/dashboard` protected by AuthRouter
- **UI Components**: Component library in `/src/components` with Storybook stories
- **Styling**: TailwindCSS with component-based architecture

#### Backend Architecture

- **API Structure**: Express router in `/server/routes` with modular route files
- **Database**: Prisma ORM with MySQL, models include User (authors table), Post (posts table), Stock (stocks table), and tweet
- **Authentication**: JWT-based auth with bcrypt password hashing
- **Environment Separation**: Development (port 4000) vs Production (HTTPS port 443)

#### Development Workflow

The project uses dual-server development:

1. Frontend dev server (Vite) on port 3010 with proxy to backend
2. Backend dev server (nodemon) on port 4000
3. Hot reload for both frontend and backend changes

#### Production Deployment

- Frontend builds to `/build` directory
- Backend compiles to `/server_build`
- PM2 serves compiled backend which also serves static frontend files
- HTTPS with Let's Encrypt certificates

### Environment Variables

All environment variables are prefixed with `VITE_` for frontend access:

- `VITE_API_ENDPOINT` - Backend API URL
- `VITE_APP_TITLE`, `VITE_APP_DESCRIPTION` - App metadata
- `VITE_SENTRY_DNS`, `VITE_GA_MEASUREMENT_ID` - Analytics
- `ACCESS_TOKEN_SECRET` - JWT secret (backend only)
- `DATABASE_URL` - MySQL connection string

### Testing Strategy

- **Unit Tests**: Vitest with React Testing Library for component testing
- **E2E Tests**: Playwright with separate build pipeline (`build:e2e`)
- **Visual Tests**: Storybook with Chromatic integration
- **Validation Pipeline**: All tests, linting, and type checking run via `pnpm validate`

### Browser Extension Integration

NSX works with a separate browser extension (nsx-browser-extension) to automatically capture and post web pages that users read.
