# Browser Extension Modernization Workflow - 2025 Tech Stack

> **Objective**: Migrate legacy Webpack-based browser extension to modern WXT framework with Vite, Node 22, and latest best practices.

## 📊 Current State Analysis

### Legacy Stack (To Replace)
| Component | Current | Issue |
|-----------|---------|-------|
| **Runtime** | Node 16.20.1 | EOL since Sept 2023 |
| **Build Tool** | Webpack 5 | Complex config, slow builds |
| **Module System** | CommonJS | Outdated for 2025 |
| **TS Target** | ES5 | Too conservative |
| **Testing** | Mocha | Older framework |
| **Browser Configs** | 3 separate files | Hard to maintain |

### Modern Stack (Already Present ✅)
- React 19.2.0
- TypeScript 5.9.3
- TailwindCSS v4.1.14
- Manifest V3 compliant
- Dexie, axios, RxJS (all latest)

---

## 🎯 Target 2025 Tech Stack

### Core Framework
```bash
WXT (latest)              # Next-gen extension framework
├── Vite 6.x             # 10x faster builds than Webpack
├── Node 22 LTS          # Latest stable runtime
└── pnpm 9.x             # Fast package manager
```

### Development Stack
- **TypeScript 5.6+** with ESNext + ESM
- **Vitest 2.x** - Modern test runner
- **ESLint 9** with Flat Config
- **Testing Library** for React components
- **Prettier 3.x** for formatting

### Why WXT Framework?
✅ Best-in-class Developer Experience (Nuxt.js-inspired)
✅ First-class cross-browser support (Chrome, Firefox, Safari, Edge)
✅ Active community (7.2k+ GitHub stars)
✅ Framework-agnostic (works with React, Vue, Svelte, Solid)
✅ Auto-reload during development
✅ Consistent `browser` API (abstracts chrome vs browser)
✅ **Single config file** vs 3 webpack configs

---

## 📋 Implementation Workflow

### **PHASE 1: Foundation Setup** (1-2 days)

#### 1.1 Environment Preparation
```bash
# Update Node version with Volta
volta install node@22

# Install pnpm with Volta
volta install pnpm@latest

# Verify versions
node --version  # Should be v22.x.x
pnpm --version  # Should be v9.x.x
```

#### 1.2 Create WXT Project (Parallel to Existing)
```bash
cd browser-extension
pnpm create wxt@latest browser-extension-modern
cd browser-extension-modern

# Select options:
# - Package manager: pnpm
# - Template: react-ts
# - Install dependencies: Yes
```

#### 1.3 Configure TailwindCSS v4
```bash
pnpm add -D tailwindcss@latest postcss autoprefixer
npx tailwindcss init -p
```

#### 1.4 Verify Basic Extension
```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Test in browser (Chrome)
# Load unpacked extension from .output/chrome-mv3
```

**Deliverables:**
- ✅ WXT project structure created
- ✅ Basic extension loads in Chrome
- ✅ Hot reload working
- ✅ TailwindCSS configured

---

### **PHASE 2: Code Migration** (2-3 days)

#### 2.1 Project Structure Mapping
```
OLD (Webpack)                    →    NEW (WXT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
src/background/index.ts          →    entrypoints/background.ts
src/content/index.js             →    entrypoints/content.ts
src/popup/index.tsx              →    entrypoints/popup/main.tsx
src/popup/components/app.tsx     →    entrypoints/popup/App.tsx
src/lib/*                        →    lib/*
public/*                         →    public/*
webpack/*.js                     →    wxt.config.ts (single file!)
```

#### 2.2 Migrate Background Script
```typescript
// entrypoints/background.ts
export default defineBackground(() => {
  // Your background logic here
  browser.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
  });

  // Message handling
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Handle messages
  });
});
```

#### 2.3 Migrate Content Script
```typescript
// entrypoints/content.ts
export default defineContentScript({
  matches: ['<all_urls>'],
  main() {
    // Your content script logic
    console.log('Content script loaded');
  }
});
```

#### 2.4 Migrate Popup UI
```typescript
// entrypoints/popup/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### 2.5 Convert CommonJS → ESM
```bash
# Find all require() statements
grep -r "require(" src/

# Replace with import statements
# require('axios') → import axios from 'axios'
# module.exports = → export default
# exports.foo = → export const foo =
```

#### 2.6 Update TypeScript Config
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "types": ["vite/client", "wxt/client"]
  }
}
```

**Deliverables:**
- ✅ All scripts migrated to WXT structure
- ✅ ESM imports throughout codebase
- ✅ TypeScript using ESNext target
- ✅ No compilation errors

---

### **PHASE 3: Configuration & Assets** (1 day)

#### 3.1 WXT Configuration
```typescript
// wxt.config.ts
import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  outDir: 'dist',

  manifest: {
    name: 'Reading List',
    description: 'import current web page into the Reading List',
    version: '0.0.1',

    permissions: [
      'activeTab',
      'storage',
      'tabs',
    ],

    host_permissions: [
      '<all_urls>',
    ],

    action: {
      default_icon: 'icon.png',
      default_popup: 'popup.html',
    },
  },

  modules: ['@wxt-dev/module-react'],

  runner: {
    chromiumArgs: ['--auto-open-devtools-for-tabs'],
  },
});
```

#### 3.2 Cross-Browser Build Configuration
```json
// package.json
{
  "scripts": {
    "dev": "wxt",
    "dev:chrome": "wxt --browser chrome",
    "dev:firefox": "wxt --browser firefox",
    "dev:edge": "wxt --browser edge",

    "build": "wxt build",
    "build:chrome": "wxt build --browser chrome",
    "build:firefox": "wxt build --browser firefox",
    "build:edge": "wxt build --browser edge",

    "zip": "wxt zip",
    "zip:all": "wxt zip --browser chrome && wxt zip --browser firefox"
  }
}
```

#### 3.3 Migrate Assets
```bash
# Copy assets to public/
cp -r ../src/assets/* public/

# Update asset references in code
# From: chrome.runtime.getURL('assets/images/logo.png')
# To:   browser.runtime.getURL('/icon.png')
```

#### 3.4 Environment Variables
```bash
# .env (WXT auto-loads)
VITE_API_URL=http://localhost:4000
VITE_APP_NAME=Reading List
```

**Deliverables:**
- ✅ WXT config complete
- ✅ Cross-browser builds working
- ✅ All assets migrated
- ✅ Environment variables configured

---

### **PHASE 4: Testing Infrastructure** (1-2 days)

#### 4.1 Vitest Setup
```bash
pnpm add -D vitest @vitest/ui happy-dom @testing-library/react @testing-library/user-event
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

#### 4.2 Test Migration Pattern
```typescript
// OLD (Mocha)
describe('Component', () => {
  it('should render', () => {
    // test code
  });
});

// NEW (Vitest)
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Component', () => {
  it('should render', () => {
    render(<Component />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

#### 4.3 Component Test Example
```typescript
// lib/__tests__/getCurrentTab.test.ts
import { describe, it, expect, vi } from 'vitest';
import { getCurrentTab } from '../getCurrentTab';

describe('getCurrentTab', () => {
  it('should get current active tab', async () => {
    const mockTab = { id: 1, url: 'https://example.com' };

    global.browser = {
      tabs: {
        query: vi.fn().mockResolvedValue([mockTab]),
      },
    } as any;

    const tab = await getCurrentTab();
    expect(tab).toEqual(mockTab);
  });
});
```

#### 4.4 Update Scripts
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "typecheck": "tsc --noEmit"
  }
}
```

**Deliverables:**
- ✅ Vitest configured
- ✅ All tests migrated and passing
- ✅ Coverage reports working
- ✅ Test commands updated

---

### **PHASE 5: Quality & Tooling** (1 day)

#### 5.1 ESLint 9 Flat Config
```bash
pnpm add -D eslint@latest @eslint/js typescript-eslint
```

```javascript
// eslint.config.js
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
```

#### 5.2 Prettier Configuration
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

#### 5.3 Pre-commit Hooks
```bash
pnpm add -D husky lint-staged

# Initialize husky
pnpm exec husky init
```

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

```bash
# .husky/pre-commit
pnpm lint-staged
pnpm typecheck
```

#### 5.4 CI/CD Configuration
```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'pnpm'

      - run: pnpm install
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm build
```

**Deliverables:**
- ✅ ESLint 9 configured
- ✅ Prettier set up
- ✅ Pre-commit hooks working
- ✅ CI/CD pipeline created

---

### **PHASE 6: Validation & Cleanup** (1-2 days)

#### 6.1 Cross-Browser Testing Checklist

**Chrome:**
- [ ] Extension loads without errors
- [ ] Background script works
- [ ] Content script injects properly
- [ ] Popup UI renders correctly
- [ ] Storage persistence works
- [ ] Tab communication works

**Firefox:**
- [ ] All Chrome tests pass
- [ ] Firefox-specific APIs work
- [ ] No CSP violations
- [ ] Addon debugging works

**Edge:**
- [ ] All Chrome tests pass
- [ ] Edge store compliance
- [ ] Performance acceptable

#### 6.2 Performance Validation
```bash
# Build size comparison
pnpm build

# Old Webpack build
du -sh ../dist/chrome

# New WXT build
du -sh .output/chrome-mv3

# Lighthouse CI (optional)
pnpm add -D @lhci/cli
```

#### 6.3 Remove Legacy Code
```bash
# Remove old webpack configs
rm -rf ../webpack

# Remove old node_modules and package-lock
rm -rf ../node_modules ../package-lock.json

# Remove babel configs
rm ../.babelrc ../babel.config.js

# Update .gitignore
echo ".output/" >> .gitignore
echo "dist/" >> .gitignore
```

#### 6.4 Documentation Update
```markdown
# Update README.md

## Development

### Prerequisites
- Node.js 22 LTS
- pnpm 9+

### Setup
\`\`\`bash
pnpm install
\`\`\`

### Development
\`\`\`bash
# Chrome
pnpm dev

# Firefox
pnpm dev:firefox
\`\`\`

### Build
\`\`\`bash
# All browsers
pnpm build

# Specific browser
pnpm build:chrome
pnpm build:firefox
\`\`\`

### Testing
\`\`\`bash
pnpm test
pnpm test:coverage
\`\`\`
```

**Deliverables:**
- ✅ All browsers tested
- ✅ Performance validated
- ✅ Legacy code removed
- ✅ Documentation updated

---

## 🚀 Migration Checklist

### Pre-Migration
- [ ] Backup current codebase
- [ ] Create feature branch `feat/modernize-2025`
- [ ] Document current functionality
- [ ] Set up rollback plan

### Phase 1: Foundation
- [ ] Node 22 installed
- [ ] pnpm configured
- [ ] WXT project created
- [ ] Basic extension verified

### Phase 2: Code Migration
- [ ] Background script migrated
- [ ] Content script migrated
- [ ] Popup UI migrated
- [ ] CommonJS → ESM complete
- [ ] TypeScript modernized

### Phase 3: Configuration
- [ ] WXT config complete
- [ ] Cross-browser builds working
- [ ] Assets migrated
- [ ] Env vars configured

### Phase 4: Testing
- [ ] Vitest configured
- [ ] Tests migrated
- [ ] All tests passing
- [ ] Coverage acceptable

### Phase 5: Quality
- [ ] ESLint 9 configured
- [ ] Prettier set up
- [ ] Pre-commit hooks working
- [ ] CI/CD pipeline ready

### Phase 6: Validation
- [ ] Cross-browser tested
- [ ] Performance validated
- [ ] Legacy code removed
- [ ] Documentation updated

### Post-Migration
- [ ] Final QA pass
- [ ] Team review
- [ ] Merge to main
- [ ] Deploy to production

---

## 📊 Success Metrics

| Metric | Before | Target | Actual |
|--------|--------|--------|--------|
| **Build Time** | ~30s | <3s | ___ |
| **Bundle Size** | ~500KB | <300KB | ___ |
| **Dev Server Start** | ~10s | <2s | ___ |
| **Hot Reload** | ~5s | <1s | ___ |
| **Test Execution** | ~20s | <5s | ___ |
| **Type Check** | ~15s | <5s | ___ |

---

## 🔧 Troubleshooting

### Common Issues

**Issue: WXT not detecting entrypoints**
```bash
# Ensure correct file structure
entrypoints/
  ├── background.ts
  ├── content.ts
  └── popup/
      └── main.tsx
```

**Issue: Browser API not available**
```typescript
// Use dynamic import for browser-only code
if (typeof browser !== 'undefined') {
  const tab = await browser.tabs.getCurrent();
}
```

**Issue: TailwindCSS not working**
```css
/* Ensure in your main CSS file */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Issue: Vitest can't find modules**
```typescript
// vitest.config.ts - add alias
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

---

## 📚 Resources

### Documentation
- [WXT Framework](https://wxt.dev)
- [Vite](https://vitejs.dev)
- [Vitest](https://vitest.dev)
- [MDN Web Extensions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)

### Tools
- [Chrome Extension CLI](https://github.com/dutiyesh/chrome-extension-cli)
- [web-ext](https://github.com/mozilla/web-ext)
- [Extension.js](https://extension.js.org/)

### Community
- [WXT Discord](https://discord.gg/wxt)
- [r/browserextensions](https://reddit.com/r/browserextensions)

---

## 🎉 Next Steps

After successful migration:

1. **Monitor Performance**: Track build times and bundle sizes
2. **Gather Feedback**: Test with real users across browsers
3. **Optimize Further**: Consider code splitting, lazy loading
4. **Stay Updated**: Keep dependencies current with Dependabot
5. **Share Learnings**: Document migration experience for team

---

**Estimated Total Duration**: 7-11 days
**Risk Level**: Medium (mitigated by incremental approach)
**ROI**: High (10x build speed, modern DX, easier maintenance)

---

*Last Updated: 2025-10-11*
*Framework: WXT + Vite + React 19 + TypeScript*
