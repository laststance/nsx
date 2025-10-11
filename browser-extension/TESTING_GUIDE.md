# Browser Extension Testing Guide

## Phase 2: Manual Testing Instructions

### Prerequisites
- Chrome or Edge browser installed
- Backend server running on `http://localhost:4000` (for development testing)

### Loading the Extension in Chrome

#### Step 1: Open Extensions Page
1. Open Chrome/Edge
2. Navigate to `chrome://extensions/` (or `edge://extensions/`)
3. Enable **Developer mode** toggle (top-right corner)

#### Step 2: Load Unpacked Extension
1. Click **"Load unpacked"** button
2. Navigate to: `/Users/ryotamurakami/nsx/browser-extension/.output/chrome-mv3/`
3. Select the `chrome-mv3` folder
4. Click **"Select"**

#### Step 3: Verify Installation
- ✅ Extension should appear in the extensions list
- ✅ Icon should be visible (Reading List logo)
- ✅ No errors shown in the extension card

### Testing Checklist

#### 1. Extension Icon Test
- [ ] Extension icon visible in Chrome toolbar
- [ ] Clicking icon opens popup window
- [ ] Popup window displays correctly (~300px width)

#### 2. Popup Functionality Test
- [ ] Open popup on any webpage
- [ ] Verify page title displays correctly
- [ ] Verify current URL displays correctly
- [ ] "Save to Reading List" button is visible

#### 3. Background Script Test
- [ ] Open extension details page
- [ ] Click "Service worker" link (shows "active" if running)
- [ ] Check console for any errors
- [ ] Icon should change based on page state (if implemented)

#### 4. Content Script Test
- [ ] Navigate to any webpage
- [ ] Open browser DevTools (F12)
- [ ] Check Console for: `"Reading List content script loaded"`
- [ ] Message should appear on every page load

#### 5. API Integration Test (Requires Backend)

**Start Backend First:**
```bash
cd /Users/ryotamurakami/nsx
pnpm server:start
```

**Test Save Functionality:**
- [ ] Backend running on `http://localhost:4000`
- [ ] Open popup on any webpage
- [ ] Click "Save to Reading List" button
- [ ] Check browser console for POST request
- [ ] Verify no CORS errors
- [ ] Check backend logs for successful save

#### 6. Environment Variables Test
- [ ] Open `.output/chrome-mv3/chunks/popup-*.js`
- [ ] Search for API URL
- [ ] Should NOT contain `import.meta.env` (should be replaced with actual URL)
- [ ] Should contain `http://localhost:4000/api/v1/posts` (development build)

### Expected Behavior

#### Popup Window
```
┌─────────────────────────────────┐
│  Reading List                    │
├─────────────────────────────────┤
│  Title: [Current Page Title]    │
│  URL: [Current Page URL]        │
│                                  │
│  [Save to Reading List] Button  │
└─────────────────────────────────┘
```

#### Console Messages
```
Background: Service worker started
Content: Reading List content script loaded
Popup: Page info retrieved successfully
API: POST request to /api/v1/posts
```

### Troubleshooting

#### Extension Won't Load
- **Error**: "Manifest file is missing or unreadable"
  - **Fix**: Ensure you selected `.output/chrome-mv3/` directory, not parent folder

#### Popup Doesn't Open
- **Error**: No popup appears when clicking icon
  - **Fix**: Check background script console for errors
  - **Fix**: Verify `popup.html` exists in build output

#### Images Not Showing
- **Error**: Broken image icons
  - **Fix**: Run `pnpm build:wxt` to regenerate with images
  - **Fix**: Verify `images/` folder exists in `.output/chrome-mv3/`

#### API Calls Fail
- **Error**: `ERR_CONNECTION_REFUSED`
  - **Fix**: Ensure backend is running: `pnpm server:start`
  - **Fix**: Check port 4000 is not in use

- **Error**: CORS errors
  - **Fix**: Backend must allow `chrome-extension://` origins
  - **Fix**: Check Express CORS configuration

#### Environment Variables Not Working
- **Error**: API calls go to wrong URL
  - **Fix**: Check `.env.development` file exists
  - **Fix**: Rebuild extension: `pnpm build:wxt`
  - **Fix**: Vite replaces variables at build time, not runtime

### Development Workflow

#### Hot Reload Development
```bash
# Terminal 1: Start WXT dev server
cd browser-extension
pnpm dev

# Terminal 2: Start backend server
cd ..
pnpm server:start

# Browser: Load extension from .wxt/chrome-mv3/
# Changes auto-reload in development mode
```

#### Production Build Testing
```bash
# Build production version
pnpm build:wxt

# Load from .output/chrome-mv3/
```

### Next Steps After Testing

#### If All Tests Pass ✅
1. Document any issues found
2. Proceed with Phase 2 code migration
3. Begin webpack removal planning

#### If Tests Fail ❌
1. Document specific failures
2. Check browser console for error details
3. Verify manifest.json configuration
4. Review WXT build output for warnings
5. Report issues for resolution

## Performance Validation

### Build Metrics (Target)
- ✅ Build time: < 1 second
- ✅ Bundle size: ~247 KB
- ✅ No console errors
- ✅ All assets loaded

### Runtime Metrics
- Extension load time: < 100ms
- Popup open time: < 50ms
- API response time: < 500ms (depends on backend)
- Memory usage: < 10MB

## Cross-Browser Testing (Future)

### Firefox Testing
```bash
# Build Firefox version
pnpm build:wxt:firefox

# Load from .output/firefox-mv3/
# Navigate to about:debugging#/runtime/this-firefox
```

### Safari Testing
- Requires additional configuration
- Not yet implemented in Phase 1-2

## Security Testing

### Checklist
- [ ] No sensitive data in console logs
- [ ] API credentials not exposed in code
- [ ] HTTPS used for production API
- [ ] Content Security Policy configured
- [ ] Permission requests minimal and justified

## Accessibility Testing

### Checklist
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader compatible
- [ ] Color contrast sufficient
- [ ] Text resizing works

---

**Last Updated**: 2025-10-11
**Phase**: Phase 2 - Manual Testing
**Status**: Ready for Testing
