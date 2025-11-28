# Project Index: NSX

**Generated**: 2025-11-28 | **Stack**: React 19 + Express 5 + Prisma 7 | **Node**: 22.20.0

> Auto-posting blog/reading tracker with browser extension.

## 📁 Structure

```
nsx/
├── src/                    # React frontend (Vite + RTK Query)
│   ├── pages/              # Route components
│   ├── components/         # 17 UI component families
│   ├── redux/              # RTK Query API + slices
│   └── hooks/              # Custom hooks
├── server/                 # Express 5 backend
│   └── routes/             # post, user, stock, tweet, bluesky, translate
├── prisma/                 # Schema + migrations
├── @types/                 # Shared TS definitions (Req.*, Res.*, domain)
├── e2e/                    # Playwright tests
├── browser-extension/      # WXT Chrome extension
└── scripts/                # deploy, backup, restore
```

## 🚀 Entry Points

| Entry    | Path              | Purpose               |
| -------- | ----------------- | --------------------- |
| Frontend | `src/main.tsx`    | Vite + Redux Provider |
| Backend  | `server/index.ts` | Express + HTTPS       |
| API      | `server/api.ts`   | Route aggregator      |

## 📦 Models (Prisma)

```
User(authors)  → id, name, password, useLegacyHoverColors
Post(posts)    → id, title, body
Stock(stocks)  → id, pageTitle, url
tweet          → id, text, attachments[]
```

## 🔌 API

**Posts** `/api/posts`: `GET /post_list`, `GET /post/:id`, `POST /create`, `POST /update`, `DELETE /post/:id`

**User** `/api/user`: `POST /login`, `GET /logout`, `POST /signup`, `GET /user_count`, `PATCH /profile`, `GET|PATCH /hover-color-preference`

**Stock** `/api/stock`: `GET /stocklist`, `POST /push_stock`, `DELETE /stock/:id`

**Tweet** `/api/tweet`: `GET /`, `GET /tweet_list`, `POST /`, `DELETE /:id`

**Other**: `POST /api/translate` (OpenAI), `POST /api/bluesky`

## 🎯 Routes

```
/                    → Index (PostList)
/post/:postId        → Post (public)
/login, /signup      → Auth
/dashboard           → Protected
  /create            → Create post (StockList)
  /edit/:postId      → Edit post
  /tweet             → Tweets
  /settings/*        → Settings
```

## 🛠️ RTK Query

**Queries**: `useFetchPostListQuery`, `useFetchTweetListQuery`, `useFetchAllTweetQuery`, `useGetUserCountQuery`, `useGetHoverColorPreferenceQuery`

**Mutations**: `useCreateTweetMutation`, `useDeleteTweetMutation`, `usePostToBlueSkyMutation`, `useTranslateTextMutation`, `useUpdateProfileMutation`, `useUpdateHoverColorPreferenceMutation`

## 📦 Dependencies

`react@19` `@reduxjs/toolkit@2.11` `express@5` `prisma@7` `@atproto/api` `openai` `zod`

## 🧪 Testing

- **Unit**: `pnpm test` (Vitest)
- **Stories**: `pnpm storybook`
- **E2E**: `pnpm playwright` (auth, crud, pagination, profile)

## 📋 Commands

```bash
pnpm start              # Frontend :3010
pnpm server:start       # Backend :4000
pnpm lint && pnpm typecheck && pnpm test
pnpm db:reset           # Reset + seed
pnpm build && pnpm server:build && pnpm deploy
```

## 🔧 Env

**Required**: `VITE_API_ENDPOINT`, `ACCESS_TOKEN_SECRET`, `DATABASE_URL`
**Optional**: `OPENAI_API_KEY`, `BLUESKY_*`, `VITE_SENTRY_DNS`, `VITE_GA_*`

## 📂 Components

**Layout**: Header, Footer | **Forms**: Input, Textarea, Button | **Feedback**: Loading, Spinner, SnackBar | **Nav**: Sidebar, Pagination, Search | **Display**: PostDate, TweetCard, ToggleTheme

## 🌐 Extension

WXT Manifest V3: `background/`, `popup/`, `content/` → POST `/api/stock`
