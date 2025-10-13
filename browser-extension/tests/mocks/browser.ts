import { vi } from 'vitest'

export interface MockTab {
  id?: number
  index?: number
  pinned?: boolean
  highlighted?: boolean
  windowId?: number
  active?: boolean
  incognito?: boolean
  url?: string
  title?: string
  favIconUrl?: string
  status?: string
  width?: number
  height?: number
  lastAccessed?: number
  [key: string]: any
}

/**
 * Create a mock Tab object with sensible defaults
 */
export function createMockTab(overrides?: MockTab): MockTab {
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
  }
}

/**
 * Mock browser.tabs API with common test scenarios
 */
export function mockBrowserTabs(tabs?: chrome.tabs.Tab[]) {
  const mockTabs = tabs || [createMockTab()]

  ;(browser.tabs.query as any).mockResolvedValue(mockTabs)
  ;(browser.tabs.create as any).mockResolvedValue(mockTabs[0])
  ;(browser.tabs.update as any).mockResolvedValue(mockTabs[0])

  return { mockTabs }
}

/**
 * Mock browser.storage API
 */
export function mockBrowserStorage() {
  ;(browser.storage.local.get as any).mockResolvedValue({})
  ;(browser.storage.local.set as any).mockResolvedValue(undefined)
  ;(browser.storage.local.remove as any).mockResolvedValue(undefined)
  ;(browser.storage.local.clear as any).mockResolvedValue(undefined)
  ;(browser.storage.sync.get as any).mockResolvedValue({})
  ;(browser.storage.sync.set as any).mockResolvedValue(undefined)
}

/**
 * Mock browser.action API
 */
export function mockBrowserAction() {
  ;(browser.action.setIcon as any).mockResolvedValue(undefined)
  ;(browser.action.setBadgeText as any).mockResolvedValue(undefined)
}

/**
 * Reset all browser API mocks
 */
export function resetBrowserMocks() {
  vi.clearAllMocks()

  // Reset mock implementations to default behavior
  ;(browser.tabs.query as any).mockReset()
  ;(browser.tabs.create as any).mockReset()
  ;(browser.tabs.update as any).mockReset()
  ;(browser.action.setIcon as any).mockReset()
  ;(browser.action.setBadgeText as any).mockReset()
  ;(browser.storage.local.get as any).mockReset()
  ;(browser.storage.local.set as any).mockReset()
  ;(browser.storage.local.remove as any).mockReset()
  ;(browser.storage.local.clear as any).mockReset()
  ;(browser.storage.sync.get as any).mockReset()
  ;(browser.storage.sync.set as any).mockReset()
  ;(browser.runtime.sendMessage as any).mockReset()
}
