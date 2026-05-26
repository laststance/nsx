# NSX Browser Extension

A modern browser extension for managing reading lists and bookmarking web pages, built with the WXT framework. Seamlessly capture and organize the pages you read with a clean, intuitive interface.

## ✨ Features

- **📑 Reading List Management**: Save web pages with a single click
- **🔖 Visual Bookmark Indicators**: Icon changes to reflect bookmark status
- **🐦 Twitter Integration**: Share pages directly to Twitter with custom comments
- **🎨 Modern UI**: React-based popup interface with Tailwind CSS styling
- **🌐 Chrome Support**: Built with WXT framework (Firefox support coming soon)
- **⚡ Fast Development**: Hot Module Replacement (HMR) for rapid iteration
- **🔒 Type-Safe**: Full TypeScript strict mode support
- **🧪 Comprehensive Testing**: E2E tests with Playwright, unit tests with Vitest

## 🛠️ Tech Stack

### Core Framework

- **WXT** `0.20.11` - Next-generation web extension framework
- **Vite** `7.1.9` - Lightning-fast build tool
- **TypeScript** `5.9.3` - Type safety with strict mode

### UI Framework

- **React** `19.2.0` - Modern UI components
- **Tailwind CSS** `4.1.14` - Utility-first styling
- **Axios** `1.12.2` - HTTP client for API integration

### Testing & Quality

- **Playwright** `1.56.0` - End-to-end testing
- **Vitest** `3.2.4` - Fast unit testing
- **ESLint** `9.37.0` - Code quality with flat config
- **Prettier** `3.0.0` - Code formatting
- **Husky** `9.1.7` - Git hooks for quality gates

## 📋 Prerequisites

- **Node.js**: `22.20.0` (managed via Volta)
- **pnpm**: Package manager (workspace-aware)
- **Backend API**: NSX server running on port 4000 (required for full functionality)
- **MySQL Database**: For backend data persistence

## 🚀 Getting Started

### Installation

```bash
# Navigate to browser-extension directory
cd browser-extension

# Install dependencies
pnpm install
```

### Development

```bash
# Start development server with HMR
pnpm dev
```

The extension will be built to `.output/chrome-mv3`. Load it in your browser:

**Chrome/Edge:**

1. Navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `.output/chrome-mv3` directory

### Building for Production

```bash
# Build for Chrome (Manifest V3)
pnpm build

# Create distribution archives
pnpm zip
```

Build outputs:

- Chrome: `.output/chrome-mv3/`
- Archives: `.output/*.zip`

Build metrics:

- **Build time**: ~617ms
- **Bundle size**: ~243KB
- **48x faster** than previous webpack setup

> **Note**: Firefox support (Manifest V2) is planned for future releases. Run `pnpm build:firefox` once implemented.

## 🧪 Testing

### E2E Testing (Playwright)

```bash
# Run all E2E tests
pnpm test

# Run tests with UI mode
pnpm test:ui

# Run tests in debug mode
pnpm test:debug
```

**Important**: E2E tests require:

1. Extension must be built first (`pnpm build`)
2. Backend server must be running on port 4000
3. MySQL database must be accessible
4. Tests run in headed mode (use `xvfb-run` for CI)

Test coverage:

- ✅ **29 E2E tests** covering all critical flows
- Extension loading and service worker initialization
- Popup UI interactions and form submissions
- Icon state management and tab switching
- Backend API integration and error handling

### Unit Testing (Vitest)

```bash
# Run unit tests
pnpm test:unit

# Run tests with UI
pnpm test:unit:ui

# Run tests once (CI mode)
pnpm test:unit:run

# Run with coverage
pnpm test:coverage
```

### Run All Tests

```bash
# Run unit tests + E2E tests sequentially
pnpm test:all
```

## 📁 Project Structure

```
browser-extension/
├── src/
│   ├── entrypoints/          # WXT file-based entrypoints
│   │   ├── background.ts     # Service worker (MV3)
│   │   ├── content.ts        # Content script (<all_urls>)
│   │   └── popup/            # Popup UI entrypoint
│   │       ├── App.tsx       # React popup component
│   │       ├── main.tsx      # React render entry
│   │       ├── index.html    # Popup HTML
│   │       └── style.css     # Tailwind styles
│   ├── lib/                  # Shared utilities
│   │   ├── getCurrentTab.tsx # Active tab retrieval
│   │   └── setBookmarkIcon.ts # Icon state management
│   └── assets/               # Static assets
│       └── images/           # Extension icons
├── tests/
│   ├── e2e/                  # Playwright E2E tests
│   │   ├── fixtures.ts       # Test fixtures
│   │   ├── extension-fixture.ts # Extension loading fixture
│   │   ├── global-setup.ts   # Pre-test build
│   │   ├── extension-loading.spec.ts # 4 tests
│   │   ├── popup.spec.ts     # 11 tests
│   │   ├── icon-state.spec.ts # 5 tests
│   │   └── api-integration.spec.ts # 9 tests
│   └── unit/                 # Vitest unit tests
│       └── lib/              # Utility function tests
├── public/                   # Public assets (copied to build)
│   └── images/               # Browser-accessible images
├── wxt.config.ts             # WXT configuration
├── tsconfig.json             # TypeScript strict config
├── eslint.config.js          # ESLint 9 flat config
├── playwright.config.ts      # E2E test configuration
├── vitest.config.ts          # Unit test configuration
└── package.json              # Dependencies & scripts
```

### WXT File-Based Entrypoints

WXT automatically detects entrypoints based on file location and naming:

- `entrypoints/background.ts` → Background service worker
- `entrypoints/content.ts` → Content script
- `entrypoints/popup/` → Popup page with index.html

No manual configuration required!

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the browser-extension directory:

```env
# Backend API endpoint
VITE_API_ENDPOINT=http://localhost:4000/api/

# Optional: Analytics
VITE_SENTRY_DNS=your-sentry-dsn
VITE_GA_MEASUREMENT_ID=your-ga-id
```

### Extension Permissions

Defined in `wxt.config.ts`:

```typescript
{
  permissions: ['activeTab', 'storage', 'tabs'],
  host_permissions: ['<all_urls>']
}
```

### Browser API Usage

Always use `browser.*` API from WXT for Chrome compatibility (and future Firefox support):

```typescript
import { browser } from 'wxt/browser'

// ✅ Correct - WXT provides cross-browser compatibility
const tab = await browser.tabs.query({ active: true })

// ❌ Avoid - Direct chrome API usage
const tab = await chrome.tabs.query({ active: true })
```

## 🔧 Development Workflow

### Pre-commit Hooks

Git hooks are configured via Husky (at monorepo root):

```bash
# Automatically runs on git commit:
# 1. ESLint with auto-fix
# 2. Prettier formatting
# 3. Type checking (TypeScript)
```

### Code Quality Commands

```bash
# Lint code
pnpm lint

# Fix linting issues automatically
pnpm lint:fix

# Type check without building
pnpm typecheck

# Clean build artifacts
pnpm clean
```

### Hot Module Replacement

WXT provides sub-second HMR during development:

- **UI changes**: Instant reload in popup/options pages
- **Content scripts**: Automatic reload on file changes
- **Background scripts**: Service worker hot reload
- **Reload time**: <1s (vs 5s with webpack)

## 🏗️ CI/CD Pipeline

The extension uses GitHub Actions for continuous integration:

### Quality Checks

- ✅ ESLint validation
- ✅ TypeScript type checking
- ✅ Prettier formatting validation

### E2E Testing

- ✅ 29 Playwright tests with xvfb (virtual display)
- ✅ Backend server integration
- ✅ MySQL database connectivity

### Production Builds

- ✅ Chrome MV3 build
- ✅ Artifact retention (30 days)
- ✅ Build summary reporting

## 🎨 UI Components

The popup interface includes:

- **Page Title Display**: Shows current page title
- **Bookmark Checkbox**: Toggle bookmark status
- **Comment Textarea**: Add notes before sharing
- **Twitter Button**: Share to Twitter with custom text
- **Status Messages**: Success/failure feedback with animations

## 🔗 Backend Integration

The extension communicates with the NSX backend API:

**Endpoint**: `POST /api/posts`

**Payload**:

```json
{
  "pageTitle": "Example Page Title",
  "url": "https://example.com"
}
```

**Response**: Success status and saved post data

## 📦 Dependencies Management

```bash
# Add new dependency
pnpm add <package>

# Add dev dependency
pnpm add -D <package>

# Update dependencies
pnpm update

# Check outdated packages
pnpm outdated
```

## 🐛 Troubleshooting

### Extension Not Loading

1. Rebuild the extension: `pnpm build`
2. Remove and re-add the extension in browser
3. Check console for errors in `chrome://extensions/`

### HMR Not Working

1. Ensure dev server is running: `pnpm dev`
2. Check terminal for WXT server status
3. Reload extension manually if needed

### E2E Tests Failing

1. Build extension first: `pnpm build`
2. Start backend server: `cd .. && pnpm server:start`
3. Verify MySQL is running and accessible
4. Check database connection in `playwright.config.ts`

### CI Tests Failing on Headless

Extensions require headed mode. CI uses xvfb:

```bash
# Local CI simulation
xvfb-run --auto-servernum pnpm test
```

## 📚 Resources

- [WXT Documentation](https://wxt.dev/) - Framework guide and API reference
- [WXT Examples](https://github.com/wxt-dev/examples) - Official example projects
- [Chrome Extensions](https://developer.chrome.com/docs/extensions/) - Chrome extension docs
- [Playwright](https://playwright.dev/) - E2E testing documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run quality checks: `pnpm lint && pnpm typecheck`
5. Run tests: `pnpm test:all`
6. Commit your changes: `git commit -m "feat: add amazing feature"`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Commit Message Convention

Follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Test updates
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks

## 📄 License

ISC License - See LICENSE file for details

## 👤 Author

Ryota Murakami <dojce1048@gmail.com> (https://github.com/ryota-murakami)

---

**Built with ❤️ using [WXT](https://wxt.dev/) - Next-gen Web Extension Framework**
