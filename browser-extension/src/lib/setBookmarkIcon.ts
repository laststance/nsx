/**
 * Changes extension icon to bookmarked state
 * Sends message to background service worker to update icon
 */
export function setBookmarkedIcon(): void {
  chrome.runtime.sendMessage({
    action: 'setIcon',
    path: '../assets/images/logo-bookmarked.png',
  })
}
