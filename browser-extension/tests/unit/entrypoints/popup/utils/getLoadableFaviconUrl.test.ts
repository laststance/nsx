import { describe, expect, test } from 'vitest'

import { getLoadableFaviconUrl } from '@/entrypoints/popup/utils/getLoadableFaviconUrl'

describe('getLoadableFaviconUrl', () => {
  test('keeps a favicon served over https', () => {
    // Arrange
    const favIconUrl = 'https://example.com/favicon.ico'

    // Act
    const loadableFaviconUrl = getLoadableFaviconUrl(favIconUrl)

    // Assert
    expect(loadableFaviconUrl).toBe('https://example.com/favicon.ico')
  })

  test('keeps an inline data: image favicon', () => {
    // Arrange
    const favIconUrl = 'data:image/png;base64,iVBORw0KGgo='

    // Act
    const loadableFaviconUrl = getLoadableFaviconUrl(favIconUrl)

    // Assert
    expect(loadableFaviconUrl).toBe('data:image/png;base64,iVBORw0KGgo=')
  })

  test('drops a browser-internal favicon the popup is not allowed to load', () => {
    // Arrange
    const favIconUrl = 'chrome://theme/IDR_EXTENSIONS_FAVICON'

    // Act
    const loadableFaviconUrl = getLoadableFaviconUrl(favIconUrl)

    // Assert
    expect(loadableFaviconUrl).toBe('')
  })

  test('returns no URL for a tab without a favicon', () => {
    // Arrange
    const favIconUrl = undefined

    // Act
    const loadableFaviconUrl = getLoadableFaviconUrl(favIconUrl)

    // Assert
    expect(loadableFaviconUrl).toBe('')
  })
})
