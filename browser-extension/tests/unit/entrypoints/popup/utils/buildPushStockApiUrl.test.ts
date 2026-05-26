import { describe, expect, it } from 'vitest'

import { buildPushStockApiUrl } from '@/entrypoints/popup/utils/buildPushStockApiUrl'

describe('buildPushStockApiUrl', () => {
  it('uses the localhost backend fallback endpoint for extension E2E saves', () => {
    // Arrange
    const apiEndpoint = 'http://localhost:4000'

    // Act
    const pushStockApiUrl = buildPushStockApiUrl(apiEndpoint)

    // Assert
    expect(pushStockApiUrl).toBe('http://localhost:4000/api/push_stock')
  })

  it('keeps the existing api path when the shared endpoint includes it', () => {
    // Arrange
    const apiEndpoint = 'https://nsx.malloc.tokyo/api/'

    // Act
    const pushStockApiUrl = buildPushStockApiUrl(apiEndpoint)

    // Assert
    expect(pushStockApiUrl).toBe('https://nsx.malloc.tokyo/api/push_stock')
  })
})
