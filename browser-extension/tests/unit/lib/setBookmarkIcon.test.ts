import { describe, it, expect, beforeEach, vi } from 'vitest'

import { setBookmarkedIcon } from '@/lib/setBookmarkIcon'
import { setDefaultIcon } from '@/lib/setDefaultIcon'

import { resetBrowserMocks } from '../../mocks/browser'

describe('Icon Management Functions', () => {
  beforeEach(() => {
    resetBrowserMocks()
  })

  describe('setBookmarkedIcon', () => {
    it('should send correct message to runtime', () => {
      setBookmarkedIcon()

      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        action: 'setIcon',
        path: '../assets/images/logo-bookmarked.png',
      })
    })

    it('should send message with bookmarked icon path', () => {
      setBookmarkedIcon()

      const call = vi.mocked(chrome.runtime.sendMessage).mock.calls[0][0]
      expect(call).toHaveProperty(
        'path',
        '../assets/images/logo-bookmarked.png',
      )
    })

    it('should send message with setIcon action', () => {
      setBookmarkedIcon()

      const call = vi.mocked(chrome.runtime.sendMessage).mock.calls[0][0]
      expect(call).toHaveProperty('action', 'setIcon')
    })

    it('should be callable multiple times', () => {
      setBookmarkedIcon()
      setBookmarkedIcon()
      setBookmarkedIcon()

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(3)
    })
  })

  describe('setDefaultIcon', () => {
    it('should send correct message to runtime', () => {
      setDefaultIcon()

      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        action: 'setIcon',
        path: '../assets/images/logo.png',
      })
    })

    it('should send message with default icon path', () => {
      setDefaultIcon()

      const call = vi.mocked(chrome.runtime.sendMessage).mock.calls[0][0]
      expect(call).toHaveProperty('path', '../assets/images/logo.png')
    })

    it('should send message with setIcon action', () => {
      setDefaultIcon()

      const call = vi.mocked(chrome.runtime.sendMessage).mock.calls[0][0]
      expect(call).toHaveProperty('action', 'setIcon')
    })

    it('should be callable multiple times', () => {
      setDefaultIcon()
      setDefaultIcon()
      setDefaultIcon()

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(3)
    })
  })

  describe('Icon toggling behavior', () => {
    it('should allow toggling between bookmarked and default icons', () => {
      setBookmarkedIcon()
      setDefaultIcon()
      setBookmarkedIcon()

      expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(3)

      const calls = (chrome.runtime.sendMessage as any).mock.calls as Array<
        [{ path: string }]
      >
      expect(calls[0]?.[0]?.path).toBe('../assets/images/logo-bookmarked.png')
      expect(calls[1]?.[0]?.path).toBe('../assets/images/logo.png')
      expect(calls[2]?.[0]?.path).toBe('../assets/images/logo-bookmarked.png')
    })
  })
})
