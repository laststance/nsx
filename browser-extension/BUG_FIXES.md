# Extension Bug Fixes - 2025-10-13

## Summary
Fixed 4 critical extension bugs that were preventing proper functionality. All 29 Playwright E2E tests now pass (100%).

## Bugs Fixed

### Bug #1: HTML Structure Mismatch
**Symptom**: Tests failing with "strict mode violation" for `#popup` selector
**Root Cause**: Duplicate `id="popup"` - both in index.html `<div>` and App.tsx `<main>`
**Fix**: Removed `id` attribute from `<main>` element in App.tsx
**Files Changed**: `src/entrypoints/popup/App.tsx`

### Bug #2: Popup Shows Wrong Page Title
**Symptom**: Popup displays "Reading List" or wrong title instead of current tab's title
**Root Cause**: `getCurrentTab()` not properly identifying the active browser tab
**Fix**: Implemented robust tab query with fallback logic:
1. Try `{active: true, lastFocusedWindow: true}` (standard approach)
2. Fallback to filtering all tabs and sorting by `lastAccessed`
3. Properly filter out extension URLs
**Files Changed**: `src/lib/getCurrentTab.tsx`

### Bug #3: Tweet Button Uses Wrong URL
**Symptom**: Tweet button href contains `chrome-extension://...` instead of actual page URL
**Root Cause**: Same as Bug #2 - getCurrentTab() returning popup URL
**Fix**: Same as Bug #2, plus improved URL encoding with `encodeURIComponent()`
**Files Changed**:
- `src/lib/getCurrentTab.tsx`
- `src/entrypoints/popup/App.tsx`

### Bug #4: API Integration Not Working
**Symptom**: Backend receives popup URL instead of actual page URL in API requests
**Root Cause**: Same as Bug #2 - getCurrentTab() issue
**Fix**: Same as Bug #2 - now sends correct tab info to backend
**Files Changed**: `src/lib/getCurrentTab.tsx`

## Technical Details

### getCurrentTab() Implementation

**Before:**
```typescript
export async function getCurrentTab() {
  const allTabs = await chrome.tabs.query({})
  const browserTabs = allTabs.filter(tab =>
    tab.url && !tab.url.startsWith('chrome-extension://')
  )
  browserTabs.sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0))
  return browserTabs[0] || allTabs[0]
}
```

**After:**
```typescript
export async function getCurrentTab() {
  // Try standard approach first
  let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

  // Verify it's not an extension page
  if (tab && !tab.url?.startsWith('chrome-extension://')) {
    return tab;
  }

  // Fallback: Filter all tabs and return most recent browser tab
  const allTabs = await chrome.tabs.query({});
  const browserTabs = allTabs.filter(t =>
    t.url &&
    !t.url.startsWith('chrome-extension://') &&
    !t.url.startsWith('chrome://') &&
    !t.url.startsWith('about:')
  );

  browserTabs.sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0));
  return browserTabs[0] || allTabs[0];
}
```

**Why This Works:**
- Uses official Chrome extension pattern as primary approach
- Handles edge cases in test environments where popup context differs
- Properly filters out all types of internal URLs
- Provides robust fallback for reliability

## Test Results

**Before Fixes:** 9/29 tests passing (31%)
**After Fixes:** 29/29 tests passing (100%) ✅

## Environment Variables

Ensured proper API endpoint configuration:
- `.env.development` - `VITE_API_URL=http://localhost:4000/api/push_stock`
- `.env.production` - `VITE_API_URL=https://nsx.malloc.tokyo/api/push_stock`

## Verification

Run tests to verify all fixes:
```bash
cd browser-extension
pnpm wxt build --mode development
pnpm test
```

Expected output:
```
29 passed (45s)
```
