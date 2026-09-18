// Toolbar icons: WXT copies public/images to the build root, and chrome.action.setIcon fetches
// paths relative to background.js, so only root-absolute paths load (others fail with "Failed to fetch").
export const DEFAULT_ICON_PATH = '/images/logo.png'
export const BOOKMARKED_ICON_PATH = '/images/logo-bookmarked.png'
