import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'
import { expect, afterEach, vi } from 'vitest'

// Extend Vitest matchers with jest-dom
expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Create mock browser API
const mockBrowser = {
  runtime: {
    sendMessage: vi.fn(),
    onMessage: {
      addListener: vi.fn(),
      removeListener: vi.fn(),
    },
    onInstalled: {
      addListener: vi.fn(),
    },
  },
  tabs: {
    query: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    onUpdated: {
      addListener: vi.fn(),
    },
  },
  action: {
    setIcon: vi.fn(),
    setBadgeText: vi.fn(),
  },
  storage: {
    local: {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn(),
      clear: vi.fn(),
    },
    sync: {
      get: vi.fn(),
      set: vi.fn(),
    },
  },
}

// Set browser API globally
;(globalThis as any).browser = mockBrowser
;(globalThis as any).chrome = mockBrowser
