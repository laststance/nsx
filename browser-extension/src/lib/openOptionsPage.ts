/**
 * Opens the extension's Options page, or focuses it when it is already open
 * The NSX token is connected there; called from the popup's "Open options" link
 */
export function openOptionsPage(): void {
  void chrome.runtime.openOptionsPage()
}
