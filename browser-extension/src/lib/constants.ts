// Toolbar icons that WXT copies from public/images to the build root. chrome.action.setIcon resolves
// paths against background.js, so root-absolute paths keep pointing at the copied files.
export const DEFAULT_ICON_PATH = '/images/logo.png'
export const BOOKMARKED_ICON_PATH = '/images/logo-bookmarked.png'

// chrome.storage.local key holding the pasted NSX Personal Access Token (raw `nsx_pat_…`).
export const PAT_STORAGE_KEY = 'nsx_pat'
// chrome.storage.local flag set when the API answers 401 to the stored token. The popup detects the
// rejection, and the Options page reads this flag to ask for a new token instead of showing "Connected".
export const PAT_REJECTED_STORAGE_KEY = 'nsx_pat_rejected'
// Shape of every token the NSX API mints: `nsx_pat_` + 32 random bytes as lowercase hex (server/routes/personalAccessToken.ts).
// Catches a truncated or wrong paste on the Options page; the API still decides whether the token is live.
export const PAT_TOKEN_PATTERN = /^nsx_pat_[0-9a-f]{64}$/

// Connection state labels shared by the popup's status slot and the Options page.
export const CONNECTED_MESSAGE = 'Connected to NSX'
export const NOT_CONNECTED_MESSAGE = 'Not connected'
export const TOKEN_REJECTED_MESSAGE = 'Token rejected'
