import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

import {
  mockBrowserTabs,
  createMockTab,
  resetBrowserMocks,
} from '../../mocks/browser'

import { getCurrentTab } from '@/lib/getCurrentTab'

describe('getCurrentTab', () => {
  beforeEach(() => {
    resetBrowserMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return the current active tab when available', async () => {
    const mockTab = createMockTab({
      url: 'https://example.com',
      title: 'Example Page',
      active: true,
    })
    mockBrowserTabs([mockTab])

    const result = await getCurrentTab()

    expect(chrome.tabs.query).toHaveBeenCalledWith({
      active: true,
      lastFocusedWindow: true,
    })
    expect(result).toEqual(mockTab)
  })

  it('should return undefined when no tabs found', async () => {
    vi.mocked(chrome.tabs.query).mockResolvedValue([])

    const result = await getCurrentTab()

    expect(result).toBeUndefined()
  })

  it('should use fallback when active tab is extension page', async () => {
    const extensionTab = createMockTab({
      url: 'chrome-extension://abcd1234/popup.html',
      active: true,
    })
    const browserTab = createMockTab({
      url: 'https://github.com',
      title: 'GitHub',
      active: false,
      lastAccessed: 1000,
    })

    // First call returns extension tab
    vi.mocked(chrome.tabs.query)
      .mockResolvedValueOnce([extensionTab])
      // Second call returns all tabs
      .mockResolvedValueOnce([extensionTab, browserTab])

    const result = await getCurrentTab()

    expect(chrome.tabs.query).toHaveBeenCalledTimes(2)
    expect(result).toEqual(browserTab)
  })

  it('should filter out chrome-extension:// URLs', async () => {
    const extensionTab = createMockTab({
      url: 'chrome-extension://abc123/popup.html',
    })
    const validTab = createMockTab({
      url: 'https://example.com',
      lastAccessed: 2000,
    })

    vi.mocked(chrome.tabs.query)
      .mockResolvedValueOnce([extensionTab])
      .mockResolvedValueOnce([extensionTab, validTab])

    const result = await getCurrentTab()

    expect(result).toEqual(validTab)
  })

  it('should return chrome:// tab if it is the active tab', async () => {
    // Note: The function only filters chrome-extension:// URLs, not chrome:// or about:
    // This matches the actual implementation behavior
    const chromeTab = createMockTab({
      url: 'chrome://extensions/',
      active: true,
    })

    vi.mocked(chrome.tabs.query).mockResolvedValueOnce([chromeTab])

    const result = await getCurrentTab()

    // chrome:// URLs are returned if they're the active tab
    expect(result).toEqual(chromeTab)
  })

  it('should return about: tab if it is the active tab', async () => {
    // Note: The function only filters chrome-extension:// URLs, not chrome:// or about:
    // This matches the actual implementation behavior
    const aboutTab = createMockTab({
      url: 'about:blank',
      active: true,
    })

    vi.mocked(chrome.tabs.query).mockResolvedValueOnce([aboutTab])

    const result = await getCurrentTab()

    // about: URLs are returned if they're the active tab
    expect(result).toEqual(aboutTab)
  })

  it('should sort browser tabs by lastAccessed and return most recent', async () => {
    const extensionTab = createMockTab({
      url: 'chrome-extension://abc/popup.html',
      active: true,
    })
    const olderTab = createMockTab({
      id: 2,
      url: 'https://old-site.com',
      lastAccessed: 1000,
    })
    const newerTab = createMockTab({
      id: 3,
      url: 'https://new-site.com',
      lastAccessed: 5000,
    })

    vi.mocked(chrome.tabs.query)
      .mockResolvedValueOnce([extensionTab])
      .mockResolvedValueOnce([extensionTab, olderTab, newerTab])

    const result = await getCurrentTab()

    expect(result).toEqual(newerTab)
  })

  it('should handle tabs without lastAccessed property', async () => {
    const extensionTab = createMockTab({
      url: 'chrome-extension://abc/popup.html',
      active: true,
    })
    const tabWithoutAccess = createMockTab({
      id: 2,
      url: 'https://example.com',
      lastAccessed: undefined,
    })

    vi.mocked(chrome.tabs.query)
      .mockResolvedValueOnce([extensionTab])
      .mockResolvedValueOnce([extensionTab, tabWithoutAccess])

    const result = await getCurrentTab()

    expect(result).toEqual(tabWithoutAccess)
  })

  it('should handle tabs without URL', async () => {
    const extensionTab = createMockTab({
      url: 'chrome-extension://abc/popup.html',
      active: true,
    })
    const tabWithoutUrl = createMockTab({
      id: 2,
      url: undefined,
    })
    const validTab = createMockTab({
      id: 3,
      url: 'https://example.com',
      lastAccessed: 6000,
    })

    vi.mocked(chrome.tabs.query)
      .mockResolvedValueOnce([extensionTab])
      .mockResolvedValueOnce([extensionTab, tabWithoutUrl, validTab])

    const result = await getCurrentTab()

    // Should filter out tab without URL
    expect(result).toEqual(validTab)
  })

  it('should return first tab from allTabs if no valid browser tabs found', async () => {
    const extensionTab = createMockTab({
      url: 'chrome-extension://abc/popup.html',
      active: true,
    })
    const chromeTab = createMockTab({
      id: 2,
      url: 'chrome://extensions/',
    })

    vi.mocked(chrome.tabs.query)
      .mockResolvedValueOnce([extensionTab])
      .mockResolvedValueOnce([extensionTab, chromeTab])

    const result = await getCurrentTab()

    // Should fall back to first tab from allTabs
    expect(result).toEqual(extensionTab)
  })

  it('should handle query errors gracefully', async () => {
    vi.mocked(chrome.tabs.query).mockRejectedValueOnce(
      new Error('Tabs permission denied'),
    )

    await expect(getCurrentTab()).rejects.toThrow('Tabs permission denied')
  })
})
