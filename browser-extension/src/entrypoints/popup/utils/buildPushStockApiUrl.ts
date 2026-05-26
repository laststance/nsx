const API_PATHNAME = '/api'
const PUSH_STOCK_PATHNAME = '/push_stock'

/**
 * Builds the stock save URL from the shared VITE_API_ENDPOINT base.
 * @param apiEndpoint - The configured backend endpoint, with or without `/api`.
 * @returns The absolute POST /api/push_stock URL.
 * @example
 * buildPushStockApiUrl('http://localhost:4000') // => 'http://localhost:4000/api/push_stock'
 */
export const buildPushStockApiUrl = (apiEndpoint: string): string => {
  const endpointUrl = new globalThis.URL(apiEndpoint)
  const pathnameWithoutTrailingSlash = endpointUrl.pathname.replace(/\/$/, '')

  endpointUrl.pathname = pathnameWithoutTrailingSlash.endsWith(API_PATHNAME)
    ? `${pathnameWithoutTrailingSlash}${PUSH_STOCK_PATHNAME}`
    : `${pathnameWithoutTrailingSlash}${API_PATHNAME}${PUSH_STOCK_PATHNAME}`

  return endpointUrl.toString()
}
