import axios from 'axios'

/**
 * Logs a stock-request failure without leaking the Authorization header or raw PAT.
 *
 * Replaces `console.error(JSON.stringify(error))`, whose axios `toJSON()` payload carries
 * `config.headers` (the Bearer token). Logs only the HTTP status + message, never the config.
 * @param error - The unknown error thrown by axios during a stock read/write.
 * @returns Nothing; writes one redacted line to the console.
 * @example
 * logStockRequestError(error) // logs "Stock request failed: status=401 message=Request failed with status code 401"
 */
export const logStockRequestError = (error: unknown): void => {
  if (axios.isAxiosError(error)) {
    console.error(
      `Stock request failed: status=${error.response?.status ?? 'unknown'} message=${error.message}`,
    )
    return
  }
  console.error('Stock request failed: unknown error')
}
