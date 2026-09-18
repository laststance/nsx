// Toolbar icons that WXT copies from public/images to the build root. chrome.action.setIcon resolves
// paths against background.js, so root-absolute paths keep pointing at the copied files.
export const DEFAULT_ICON_PATH = '/images/logo.png'
export const BOOKMARKED_ICON_PATH = '/images/logo-bookmarked.png'
