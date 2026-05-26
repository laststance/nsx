import { describe, expect, it } from 'vitest'

import { buildStockExistsUrl } from '@/entrypoints/popup/utils/buildStockExistsUrl'

describe('buildStockExistsUrl', () => {
  it('routes popup duplicate checks to the stock exists endpoint', () => {
    // Arrange
    const pushStockApiUrl = 'https://nsx.malloc.tokyo/api/push_stock'
    const currentTabUrl = 'https://example.com/articles?id=1&tag=react'

    // Act
    const stockExistsUrl = buildStockExistsUrl(pushStockApiUrl, currentTabUrl)

    // Assert
    expect(stockExistsUrl).toBe(
      'https://nsx.malloc.tokyo/api/stock/exists?url=https%3A%2F%2Fexample.com%2Farticles%3Fid%3D1%26tag%3Dreact',
    )
  })

  it('normalizes a trailing slash before the duplicate lookup', () => {
    // Arrange
    const pushStockApiUrl = 'http://localhost:4000/api/push_stock/'
    const currentTabUrl = 'https://example.com/'

    // Act
    const stockExistsUrl = buildStockExistsUrl(pushStockApiUrl, currentTabUrl)

    // Assert
    expect(stockExistsUrl).toBe(
      'http://localhost:4000/api/stock/exists?url=https%3A%2F%2Fexample.com',
    )
  })
})
