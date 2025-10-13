export async function getCurrentTab() {
  // For popup extensions, try to get the active tab from the window
  // that was focused when the popup opened
  let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  
  // If we got a result and it's not an extension page, return it
  if (tab && !tab.url?.startsWith('chrome-extension://')) {
    return tab;
  }
  
  // Fallback: Get all tabs, filter out extension pages, and return most recent
  const allTabs = await chrome.tabs.query({});
  const browserTabs = allTabs.filter(t => 
    t.url && 
    !t.url.startsWith('chrome-extension://') && 
    !t.url.startsWith('chrome://') &&
    !t.url.startsWith('about:')
  );
  
  // Sort by last accessed and return the most recent
  browserTabs.sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0));
  
  return browserTabs[0] || allTabs[0];
}
