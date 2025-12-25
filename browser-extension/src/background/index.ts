/**
 * Background service worker for NSX browser extension
 * Manages extension icon state based on bookmark actions
 */

interface SetIconMessage {
  action: 'setIcon'
  path: string
}

/**
 * Listen for messages from the popup
 * Updates extension icon when user bookmarks a page
 */
chrome.runtime.onMessage.addListener((request: unknown) => {
  const message = request as SetIconMessage
  if (message.action === 'setIcon') {
    chrome.action.setIcon({ path: message.path })
  }
})

/**
 * Reset icon to default when user switches tabs
 * Prevents outdated bookmarked state from persisting
 */
chrome.tabs.onActivated.addListener(() => {
  chrome.action.setIcon({ path: '../assets/images/logo.png' })
})
