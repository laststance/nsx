import { describe, expect, test } from 'vitest'

import { buildPushStockApiUrl } from '@/entrypoints/popup/utils/buildPushStockApiUrl'

describe('buildPushStockApiUrl', () => {
  test('uses the localhost backend fallback endpoint for extension E2E saves', () => {
    // Arrange
    const apiEndpoint = 'http://localhost:4000'

    // Act
    const pushStockApiUrl = buildPushStockApiUrl(apiEndpoint)

    // Assert
    expect(pushStockApiUrl).toBe('http://localhost:4000/api/push_stock')
  })

  test('keeps the existing api path when the shared endpoint includes it', () => {
    // Arrange
    const apiEndpoint = 'https://nsx.malloc.tokyo/api/'

    // Act
    const pushStockApiUrl = buildPushStockApiUrl(apiEndpoint)

    // Assert
    expect(pushStockApiUrl).toBe('https://nsx.malloc.tokyo/api/push_stock')
  })
})
