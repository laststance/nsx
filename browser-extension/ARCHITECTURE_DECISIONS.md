# WXT Migration Architecture Decisions

**Version**: 1.0  
**Date**: 2025-10-11  
**Status**: Active Reference Document

## Overview

This document records all significant architectural decisions made during the WXT migration project. Each decision includes context, alternatives considered, and rationale.

---

## ADR-001: WXT Framework Selection

**Date**: 2025-10-09  
**Status**: ✅ Accepted  
**Impact**: Foundation

### Context
Need to modernize browser extension from webpack-based build to modern framework with better DX and performance.

### Decision
Adopt WXT framework built on Vite 6 for all browser extension development.

### Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **WXT** | File-based entrypoints, HMR, cross-browser, modern DX | Newer ecosystem, less mature | ✅ **Selected** |
| **CRXJS** | Vite-based, good DX | Chrome-focused, less cross-browser support | ❌ Rejected |
| **Webpack 5** | Mature, familiar | Slow builds, complex config, outdated | ❌ Current problem |
| **Manual Vite** | Full control | Requires custom manifest handling | ❌ Too much work |
| **Plasmo** | Good DX, TypeScript | Opinionated, vendor lock-in concerns | ❌ Less flexible |

### Rationale
- **Performance**: 48x faster builds (30s → 617ms) proven in Phase 1
- **DX**: File-based entrypoints simplify configuration
- **Cross-browser**: First-class support for Chrome, Firefox, Edge, Safari
- **Modern Stack**: Vite 6, React 19, TypeScript ESNext
- **Active Development**: Strong community, regular updates

### Consequences
- **Positive**: Dramatically improved build speed and DX
- **Negative**: Team learning curve, newer ecosystem
- **Risks**: Potential breaking changes in early versions (mitigated by pinning versions)

---

## ADR-002: Directory Structure - src/shared/ for Utilities

**Date**: 2025-10-11  
**Status**: ✅ Accepted  
**Impact**: Code Organization

### Context
Need to organize shared utilities, components, and hooks that are used across entrypoints (background, content, popup).

### Decision
Create `src/shared/` directory for all shared code, **not** `src/entrypoints/`.

**Structure**:
```
src/
├── entrypoints/          # Entry files only
│   ├── background.ts
│   ├── content.ts
│   └── popup/
├── shared/               # Shared code
│   ├── utils/            # Utilities
│   ├── components/       # React components
│   ├── hooks/            # React hooks
│   └── types/            # TypeScript types
```

### Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **src/shared/** | Clear separation, scales well | Slightly longer imports | ✅ **Selected** |
| **src/lib/** | Short name | Not descriptive, conflicts with node_modules convention | ❌ Rejected |
| **src/common/** | Common pattern | Less semantic meaning | ❌ Rejected |
| **entrypoints/shared/** | Everything in entrypoints | Semantically wrong, entrypoints should be entry files only | ❌ Rejected |
| **src/utils/, src/components/** | Flat structure | Doesn't group related code, harder to navigate | ❌ Rejected |

### Rationale
- **Semantic Clarity**: "shared" clearly indicates code used across entrypoints
- **Scalability**: Easy to add new categories (hooks, types, constants)
- **WXT Best Practice**: Entrypoints directory for entry files only
- **Import Clarity**: `@/shared/utils/getCurrentTab` is self-documenting

### Consequences
- **Positive**: Clean code organization, easy to find shared code
- **Negative**: Slightly longer import paths
- **Migration Impact**: Need to move `src/lib/` to `src/shared/utils/`

---

## ADR-003: Browser API - Use WXT's browser.* Global

**Date**: 2025-10-11  
**Status**: ✅ Accepted  
**Impact**: API Usage

### Context
Browser extension APIs need to work across Chrome, Firefox, Edge with different native APIs (chrome.* vs browser.*).

### Decision
Use WXT's global `browser` object exclusively, not `chrome.*` API.

**Pattern**:
```typescript
// ✅ CORRECT
import { browser } from 'wxt/browser'

export async function getCurrentTab() {
  const [tab] = await browser.tabs.query({ active: true })
  return tab
}

// ❌ INCORRECT
export async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true }) // Chrome-only
  return tab
}
```

### Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **WXT browser global** | Cross-browser, type-safe, no polyfill needed | Requires WXT import | ✅ **Selected** |
| **chrome.* API** | Native to Chrome | Chrome-only, requires polyfill for Firefox | ❌ Rejected |
| **webextension-polyfill** | Cross-browser | Additional dependency, runtime overhead | ❌ Rejected |
| **Conditional detection** | Fine-grained control | Complex, error-prone, maintenance burden | ❌ Rejected |

### Rationale
- **Type Safety**: WXT provides full TypeScript definitions
- **Cross-Browser**: Works on Chrome, Firefox, Edge, Safari without changes
- **Performance**: No runtime polyfill overhead
- **Simplicity**: Single import, consistent API surface

### Consequences
- **Positive**: Code works across all browsers without modification
- **Negative**: Slight WXT framework coupling (acceptable trade-off)
- **Migration Impact**: Replace all `chrome.*` with `browser.*` in Phase 2A

---

## ADR-004: Icon Management - Direct browser.action.setIcon

**Date**: 2025-10-11  
**Status**: ✅ Accepted  
**Impact**: Architecture Simplification

### Context
Old implementation used message passing through background script to change extension icon, adding unnecessary complexity.

### Decision
Use direct `browser.action.setIcon()` calls from popup, **not** background script messaging.

**OLD Pattern** (❌ Complex):
```typescript
// Popup sends message
chrome.runtime.sendMessage({ action: 'setIcon', path: '...' })

// Background script receives and processes
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'setIcon') {
    chrome.action.setIcon({ path: message.path })
  }
})
```

**NEW Pattern** (✅ Simple):
```typescript
// Popup calls directly
await browser.action.setIcon({ path: '/images/logo-bookmarked.png' })
```

### Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Direct calls** | Simple, fast, fewer moving parts | None significant | ✅ **Selected** |
| **Background messaging** | Centralized icon logic | Unnecessary complexity, slower, harder to debug | ❌ Current problem |
| **State management** | Predictable state updates | Overkill for simple icon changes | ❌ Over-engineered |

### Rationale
- **Simplicity**: Fewer moving parts, easier to understand
- **Performance**: No message round-trip delay
- **Maintainability**: Clearer code intent, easier to test
- **Debugging**: Simpler call stack, fewer failure points

### Consequences
- **Positive**: Simpler architecture, faster icon changes
- **Negative**: None identified
- **Migration Impact**: Remove background script icon handling in Phase 2A

---

## ADR-005: Testing Stack - Vitest + Playwright

**Date**: 2025-10-11  
**Status**: ✅ Accepted  
**Impact**: Testing Infrastructure

### Context
Need modern testing framework aligned with Vite ecosystem, replacing Mocha (legacy).

### Decision
Use **Vitest** for unit + integration tests, **Playwright** for E2E tests.

**Test Structure**:
```
tests/
├── unit/                 # Vitest - isolated function tests
├── integration/          # Vitest - component + API tests
├── e2e/                  # Playwright - browser automation
│   └── MANUAL_E2E.md     # Manual testing checklist
├── mocks/                # Browser API mocks
└── setup.ts              # Test configuration
```

### Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Vitest** | Vite-native, fast, modern DX | Newer ecosystem | ✅ **Selected for unit/int** |
| **Jest** | Mature, widely used | Slow, not Vite-optimized | ❌ Rejected |
| **Mocha** | Currently used | Outdated, poor DX | ❌ Current problem |
| **Playwright** | Real browser, cross-browser | Setup complexity | ✅ **Selected for E2E** |
| **Puppeteer** | Chrome DevTools Protocol | Chrome-only | ❌ Limited |
| **Cypress** | Good DX | Not ideal for extensions | ❌ Rejected |

### Rationale
- **Vitest Benefits**:
  - Native Vite integration (shares config)
  - ESM support out of the box
  - Fast test execution (<100ms startup)
  - Modern snapshot testing
  - Built-in code coverage (V8)

- **Playwright Benefits**:
  - Real browser automation
  - Cross-browser testing (Chrome, Firefox, Edge)
  - Network interception
  - Screenshot + video recording
  - Extension loading support

### Consequences
- **Positive**: Modern testing DX, fast execution, cross-browser E2E
- **Negative**: Playwright setup complexity for extensions (mitigated with manual E2E checklist)
- **Migration Impact**: Replace Mocha tests with Vitest in Phase 3

---

## ADR-006: ESLint 9 Flat Config Format

**Date**: 2025-10-11  
**Status**: ✅ Accepted  
**Impact**: Code Quality

### Context
ESLint moving to new flat config format, old .eslintrc.js format deprecated.

### Decision
Migrate to **ESLint 9 flat config** (eslint.config.js) now, not defer.

**New Format**:
```javascript
// eslint.config.js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // ... config objects
]
```

**OLD Format** (Deprecated):
```javascript
// .eslintrc.js
module.exports = {
  extends: ['eslint:recommended'],
  // ... config
}
```

### Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **ESLint 9 flat** | Future-proof, better TypeScript support | Migration effort | ✅ **Selected** |
| **Keep .eslintrc** | No migration needed | Deprecated, will break in ESLint 10 | ❌ Tech debt |
| **Defer to later** | Less immediate work | Will need migration anyway | ❌ Kicking can |

### Rationale
- **Future-Proofing**: ESLint 9 is current, flat config is the future
- **Better TypeScript**: Improved TS plugin integration
- **Cleaner Config**: More readable, composable config objects
- **Alignment**: Already migrating other tools, do linting together

### Consequences
- **Positive**: Modern linting setup, aligned with ESLint roadmap
- **Negative**: One-time migration effort in Phase 4
- **Risks**: Team needs to learn new config format (mitigated with documentation)

---

## ADR-007: React Version - Keep React 18 in Extension

**Date**: 2025-10-11  
**Status**: ✅ Accepted  
**Impact**: Monorepo Dependencies

### Context
Monorepo root uses React 19, browser extension could use React 19 or stay on React 18.

### Decision
Keep browser extension on **React 18**, **not** upgrade to React 19.

**Rationale**:
```json
{
  "root": {
    "dependencies": {
      "react": "^19.2.0"     // Root project
    }
  },
  "browser-extension": {
    "dependencies": {
      "react": "^18.3.1"     // Extension stays on 18
    }
  }
}
```

### Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Keep React 18** | Stable, no migration risk, proven | Not latest | ✅ **Selected** |
| **Upgrade to React 19** | Latest features, unified version | Breaking changes, migration effort, risk | ❌ Rejected |
| **Test both** | Validate compatibility | Extra work, delays migration | ❌ Over-engineering |

### Rationale
- **Stability First**: React 18 is battle-tested and stable
- **Monorepo Independence**: Separate concerns, extension can evolve independently
- **Risk Mitigation**: Avoid unnecessary breaking changes during WXT migration
- **Focus**: Prioritize WXT migration, defer React 19 to Phase 7+
- **No Blockers**: React 18 supports all current features (hooks, Suspense, etc.)

### Consequences
- **Positive**: Lower migration risk, stable foundation
- **Negative**: Miss out on React 19 features (compiler, actions)
- **Future**: Can upgrade to React 19 later after WXT migration stable

---

## ADR-008: Browser Testing Priority - Chrome → Firefox → Edge → Safari

**Date**: 2025-10-11  
**Status**: ✅ Accepted  
**Impact**: Testing Strategy

### Context
Need to prioritize browser testing with limited time and resources.

### Decision
Test browsers in priority order: **Chrome → Firefox → Edge → Safari (deferred)**.

**Priority Rationale**:

| Browser | Priority | Phase | Rationale |
|---------|----------|-------|-----------|
| **Chrome** | P1 (Critical) | Phase 2, 5 | Market leader (65%), dev baseline, primary target |
| **Firefox** | P2 (High) | Phase 5A | Privacy-focused users (3%), API differences, open source |
| **Edge** | P3 (Medium) | Phase 5B | Chromium-based (4%), minimal differences from Chrome |
| **Safari** | P4 (Low) | Phase 7+ | Requires Apple Developer ($99/yr), Safari-specific APIs, complex setup |

### Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Chrome first** | Largest market, baseline | None | ✅ **Selected** |
| **All parallel** | Comprehensive coverage | Too slow, resource-intensive | ❌ Impractical |
| **Chrome only** | Fast, simple | Ignores 35% of users | ❌ Incomplete |
| **Safari priority** | Apple ecosystem | Costly ($99), complex, small market (2%) | ❌ Deferred |

### Rationale
- **Market Share**: Chrome (65%) > Edge (4%) > Firefox (3%) > Safari (2%)
- **Development Baseline**: Chrome is development and testing baseline
- **Chromium Advantages**: Edge shares Chromium base with Chrome (minimal differences)
- **Firefox Importance**: API differences justify testing, privacy-conscious users
- **Safari Complexity**: Requires paid developer account, Safari-specific manifest, deferred to Phase 7+

### Consequences
- **Positive**: Focus effort where most users are, validate cross-browser early (Firefox)
- **Negative**: Safari users unsupported in v1
- **Risks**: Safari API differences may require refactoring (acceptable for Phase 7+)

---

## ADR-009: Path Aliases - @ for src/

**Date**: 2025-10-11  
**Status**: ✅ Accepted  
**Impact**: Import Paths

### Context
Need consistent import paths across codebase, avoid relative path hell.

### Decision
Use **@/** path alias** for src/ directory.

**Pattern**:
```typescript
// ✅ CORRECT - Clean, absolute-style imports
import { getCurrentTab } from '@/shared/utils/getCurrentTab'
import App from '@/entrypoints/popup/App'

// ❌ INCORRECT - Relative path hell
import { getCurrentTab } from '../../shared/utils/getCurrentTab'
import App from '../entrypoints/popup/App'
```

**Configuration**:
```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

// vitest.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **@ alias** | Clean, widely adopted | Requires config | ✅ **Selected** |
| **~ alias** | Alternative convention | Less common | ❌ Less standard |
| **Relative paths** | No config needed | Brittle, hard to refactor | ❌ Maintenance burden |
| **Multiple aliases** | Fine-grained control | Complex, overkill | ❌ Over-engineered |

### Rationale
- **Readability**: `@/shared/utils/` clearer than `../../shared/utils/`
- **Refactoring**: Moving files doesn't break imports
- **Convention**: @ is widely adopted in Vue, React, TypeScript communities
- **Consistency**: All imports look similar regardless of file depth

### Consequences
- **Positive**: Clean imports, easy refactoring, better DX
- **Negative**: Requires config in multiple places (ts, vitest)
- **Migration**: Update all imports in Phase 2B

---

## ADR-010: Code Coverage Target - >60% Overall

**Date**: 2025-10-11  
**Status**: ✅ Accepted  
**Impact**: Testing Standards

### Context
Starting from 0% test coverage (inherited from legacy codebase), need realistic target for Phase 3.

### Decision
Target **>60% overall code coverage**, with tiered targets by code type.

**Coverage Targets**:

| Code Type | Target | Rationale |
|-----------|--------|-----------|
| **Utilities** | >80% | Pure functions, easy to test, critical |
| **Hooks** | >80% | Reusable logic, well-defined inputs/outputs |
| **Components** | >60% | UI logic, harder to test, critical paths |
| **Entrypoints** | >60% | Integration points, harder to mock |
| **Overall** | **>60%** | Balanced target, achievable in Phase 3 |

### Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **>60% overall** | Achievable, meaningful improvement | Not 100% | ✅ **Selected** |
| **>80% overall** | High quality | Unrealistic for Phase 3, blocks progress | ❌ Too ambitious |
| **100% coverage** | Perfect | Impossible for UI code, diminishing returns | ❌ Unrealistic |
| **>40% overall** | Easy to achieve | Too low, insufficient quality bar | ❌ Too lenient |
| **No target** | No pressure | No accountability, drift | ❌ Unacceptable |

### Rationale
- **Pragmatic**: 60% is meaningful improvement from 0%
- **Focused**: High coverage where it matters (utilities, hooks)
- **Achievable**: Realistic for Phase 3 timeline (1-2 days)
- **Quality Gate**: CI fails if coverage drops below threshold
- **Iterative**: Can increase target in Phase 7+ (aim for 80%)

### Consequences
- **Positive**: Clear quality bar, automated enforcement, focus on critical paths
- **Negative**: Not 100% coverage (acceptable for initial migration)
- **Risks**: May miss edge cases (mitigated by manual testing + E2E)

---

## ADR-011: Playwright Extension Testing - Persistent Context Pattern

**Date**: 2025-10-12
**Status**: ✅ Accepted
**Impact**: E2E Testing Infrastructure

### Context
Need automated E2E testing for browser extension that actually loads the extension in a real browser environment. Initial implementation using `launchOptions` failed with "No service worker found" errors.

### Decision
Use **Playwright's `chromium.launchPersistentContext()`** pattern with custom fixtures for extension testing.

**Correct Pattern**:
```typescript
// tests/e2e/extension-fixture.ts
import { test as base, chromium, type BrowserContext } from '@playwright/test';

export const test = base.extend<ExtensionTestFixtures>({
  context: async ({}, use) => {
    const pathToExtension = path.join(__dirname, '../../.output/chrome-mv3');

    // CRITICAL: Use launchPersistentContext
    const context = await chromium.launchPersistentContext('', {
      headless: false,  // Extensions require headed mode
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });

    await use(context);
    await context.close();
  },

  extensionId: async ({ context }, use) => {
    // Wait for service worker with retry
    let serviceWorker = context.serviceWorkers()[0];
    if (!serviceWorker) {
      serviceWorker = await context.waitForEvent('serviceworker', {
        timeout: 10000,
      });
    }

    const extensionId = serviceWorker.url().split('/')[2];
    await use(extensionId);
  },
});
```

**Configuration Requirements**:
```typescript
// playwright.config.ts
projects: [
  {
    name: 'chromium-extension',
    use: {
      ...devices['Desktop Chrome'],
      channel: 'chromium',  // REQUIRED for extension support
    },
  },
],
```

### Alternatives Considered

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **launchPersistentContext** | Works correctly, official pattern | Requires custom fixtures | ✅ **Selected** |
| **launchOptions config** | Simpler config | Doesn't work for extensions | ❌ Doesn't work |
| **Mock-based testing** | Fast, no real browser | Doesn't test real extension loading | ❌ Insufficient |
| **Manual testing only** | No automation setup | Time-consuming, error-prone | ❌ Not sustainable |

### Rationale

**Key Discoveries from Official Docs**:
1. **Persistent Context Required**: Regular `browser.launch()` doesn't support extension loading
2. **Service Worker Wait**: Must wait for service worker registration with retry logic
3. **Headed Mode Required**: Extensions cannot load in headless mode (`headless: false`)
4. **Channel Specification**: Must use `channel: 'chromium'` in config for extension support
5. **Dynamic Extension ID**: Extension ID changes between builds, must extract dynamically

**Comparison with clean-url Project**:
- clean-url: Uses mock-based testing (doesn't load real extension)
- NSX: Uses real extension loading (tests actual browser behavior)
- **Verdict**: Real extension testing provides better validation despite setup complexity

### Consequences

**Positive**:
- ✅ Real browser automation testing working
- ✅ Service worker loading verified
- ✅ Extension manifest accessible
- ✅ All 4 foundation tests passing (779ms avg per test)
- ✅ CI-ready pattern (works in GitHub Actions)

**Negative**:
- ⚠️ Requires headed mode (cannot run truly headless)
- ⚠️ More complex setup than mock-based testing
- ⚠️ Extension must be built before tests run

**Migration Impact**:
- Created new `extension-fixture.ts` with correct pattern
- Deprecated old `fixtures.ts` (kept for reference)
- Updated `playwright.config.ts` with `channel: 'chromium'`
- Documented limitations in WXT_MIGRATION_MASTER_PLAN.md

### Test Results

**Current Coverage** (2025-10-12):
```
Running 4 tests using 1 worker
Extension ID: ldfacdgadnepboioboipiofdogddffgg
  ✓ extension loads and service worker is registered (779ms)
  ✓ popup page loads successfully (829ms)
  ✓ extension manifest is accessible (647ms)
  ✓ background service worker responds (575ms)
4 passed (4.2s)
```

**Future Tests Planned**:
- Popup UI interactions (11 tests)
- Icon state changes (5 tests)
- API integration (10 tests)

### Best Practices Established

1. **Extension Build First**: Always run `pnpm build` before tests
2. **Service Worker Wait**: Implement retry logic for service worker detection
3. **Dynamic ID Extraction**: Parse extension ID from service worker URL
4. **Fixture-Based Tests**: Use custom fixtures for extension context
5. **Popup Opening**: Open via `chrome-extension://{id}/popup.html` directly

---

## Decision Summary

### Approved Decisions

| ADR | Decision | Impact | Status |
|-----|----------|--------|--------|
| ADR-001 | WXT Framework | Foundation | ✅ Implemented |
| ADR-002 | src/shared/ Structure | Code Org | ✅ Accepted |
| ADR-003 | browser.* API | API Usage | 🔄 In Progress |
| ADR-004 | Direct Icon Calls | Simplification | 🔄 In Progress |
| ADR-005 | Vitest + Playwright | Testing | 🔄 Playwright Implemented |
| ADR-006 | ESLint 9 Flat | Quality | ⏳ Pending |
| ADR-007 | Keep React 18 | Dependencies | ✅ Accepted |
| ADR-008 | Browser Priority | Testing | ✅ Accepted |
| ADR-009 | @ Path Alias | Imports | ✅ Configured |
| ADR-010 | >60% Coverage | Quality | ⏳ Pending |
| ADR-011 | Persistent Context Pattern | E2E Testing | ✅ Implemented |

### Key Principles

1. **Performance First**: Choose tools that optimize build speed and DX
2. **Simplicity Over Complexity**: Remove unnecessary abstractions
3. **Cross-Browser Support**: Design for Chrome, Firefox, Edge from day 1
4. **Future-Proofing**: Use modern standards (ESM, ESLint 9, React 19 ready)
5. **Pragmatic Quality**: Meaningful coverage targets, not perfection

### Future Decisions

**Phase 7+ Considerations**:
- ADR-012: State Management (Redux vs Zustand vs Jotai)
- ADR-013: Safari Support Strategy
- ADR-014: Storage Strategy (local vs sync vs IndexedDB)
- ADR-015: Analytics Integration (Sentry, GA4, etc.)
- ADR-016: Internationalization (i18n) Approach

---

**Last Updated**: 2025-10-12
**Status**: Living Document
**Owner**: Browser Extension Team

**Revision History**:
- v1.0 (2025-10-11): Initial architecture decisions (ADR-001 through ADR-010)
- v1.1 (2025-10-12): Added ADR-011 Playwright testing pattern with persistent context
