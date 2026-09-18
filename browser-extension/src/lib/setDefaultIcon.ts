import { DEFAULT_ICON_PATH } from './constants'

/**
 * Resets extension icon to default (unbookmarked) state
 * Sends message to background service worker to update icon
 */
export function setDefaultIcon(): void {
  chrome.runtime.sendMessage({
    action: 'setIcon',
    path: DEFAULT_ICON_PATH,
  })
}
