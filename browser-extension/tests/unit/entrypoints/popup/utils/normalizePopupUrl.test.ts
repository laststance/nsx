import { describe, expect, test } from 'vitest'

import { normalizePopupUrl } from '@/entrypoints/popup/utils/normalizePopupUrl'

describe('normalizePopupUrl', () => {
  test('treats a trailing slash URL as the same stocked page', () => {
    // Arrange
    const currentTabUrl = 'https://example.com/'

    // Act
    const normalizedUrl = normalizePopupUrl(currentTabUrl)

    // Assert
    expect(normalizedUrl).toBe('https://example.com')
  })

  test('keeps a URL without trailing slash unchanged', () => {
    // Arrange
    const currentTabUrl = 'https://example.com/articles?id=1'

    // Act
    const normalizedUrl = normalizePopupUrl(currentTabUrl)

    // Assert
    expect(normalizedUrl).toBe('https://example.com/articles?id=1')
  })
})
