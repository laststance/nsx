import { normalizePopupUrl } from './normalizePopupUrl'

/**
 * Builds the duplicate-check endpoint from the existing save endpoint env var.
 * @param pushStockApiUrl - The configured POST /api/push_stock endpoint.
 * @param stockUrl - The current page URL to check.
 * @returns A GET /api/stock/exists URL with the normalized stock URL in query params.
 * @example
 * buildStockExistsUrl('https://nsx.test/api/push_stock', 'https://example.com/')
 */
export const buildStockExistsUrl = (
  pushStockApiUrl: string,
  stockUrl: string,
): string => {
  const stockExistsUrl = new globalThis.URL(pushStockApiUrl)
  stockExistsUrl.pathname = stockExistsUrl.pathname.replace(
    /\/push_stock\/?$/,
    '/stock/exists',
  )
  stockExistsUrl.searchParams.set('url', normalizePopupUrl(stockUrl))

  return stockExistsUrl.toString()
}
