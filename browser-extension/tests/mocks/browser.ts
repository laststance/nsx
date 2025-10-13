import { vi } from 'vitest'

/**
 * Create a mock Tab object with sensible defaults
 */
export function createMockTab(
  overrides?: Partial<chrome.tabs.Tab>,
): chrome.tabs.Tab {
  return {
    id: 1,
    index: 0,
    pinned: false,
    highlighted: false,
    windowId: 1,
    active: true,
    incognito: false,
    url: 'https://example.com',
    title: 'Example Page',
    favIconUrl: 'https://example.com/favicon.ico',
    status: 'complete',
    width: 1280,
    height: 720,
    ...overrides,
  } as chrome.tabs.Tab
}

/**
 * Mock browser.tabs API with common test scenarios
 */
export function mockBrowserTabs(tabs?: chrome.tabs.Tab[]) {
  const mockTabs = tabs || [createMockTab()]

  vi.mocked(browser.tabs.query).mockResolvedValue(mockTabs)
  vi.mocked(browser.tabs.create).mockResolvedValue(mockTabs[0])
  vi.mocked(browser.tabs.update).mockResolvedValue(mockTabs[0])

  return { mockTabs }
}

/**
 * Mock browser.storage API
 */
export function mockBrowserStorage() {
  vi.mocked(browser.storage.local.get).mockResolvedValue({})
  vi.mocked(browser.storage.local.set).mockResolvedValue(undefined)
  vi.mocked(browser.storage.local.remove).mockResolvedValue(undefined)
  vi.mocked(browser.storage.local.clear).mockResolvedValue(undefined)
  vi.mocked(browser.storage.sync.get).mockResolvedValue({})
  vi.mocked(browser.storage.sync.set).mockResolvedValue(undefined)
}

/**
 * Mock browser.action API
 */
export function mockBrowserAction() {
  vi.mocked(browser.action.setIcon).mockResolvedValue(undefined)
  vi.mocked(browser.action.setBadgeText).mockResolvedValue(undefined)
}

/**
 * Reset all browser API mocks
 */
export function resetBrowserMocks() {
  vi.clearAllMocks()

  // Reset mock implementations to default behavior
  vi.mocked(browser.tabs.query).mockReset()
  vi.mocked(browser.tabs.create).mockReset()
  vi.mocked(browser.tabs.update).mockReset()
  vi.mocked(browser.action.setIcon).mockReset()
  vi.mocked(browser.action.setBadgeText).mockReset()
  vi.mocked(browser.storage.local.get).mockReset()
  vi.mocked(browser.storage.local.set).mockReset()
  vi.mocked(browser.storage.local.remove).mockReset()
  vi.mocked(browser.storage.local.clear).mockReset()
  vi.mocked(browser.storage.sync.get).mockReset()
  vi.mocked(browser.storage.sync.set).mockReset()
  vi.mocked(browser.runtime.sendMessage).mockReset()
}
