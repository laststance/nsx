/**
 * Resets extension icon to default (unbookmarked) state
 * Sends message to background service worker to update icon
 */
export function setDefaultIcon(): void {
  chrome.runtime.sendMessage({
    action: 'setIcon',
    path: '../assets/images/logo.png',
  })
}
