import type { AxiosRequestConfig } from 'axios'

/**
 * Builds the axios config for stock read/write requests, attaching the PAT as a Bearer header when connected.
 * @param token - The stored `nsx_pat_…` token, or null when the extension is not connected.
 * @returns
 * - When a token exists: a config with `Authorization: Bearer <token>`
 * - When null: an empty config (request falls back to the API's cookie path → 401 on writes)
 * @example
 * buildStockRequestConfig('nsx_pat_x') // => { headers: { Authorization: 'Bearer nsx_pat_x' } }
 * buildStockRequestConfig(null)        // => {}
 */
export const buildStockRequestConfig = (
  token: string | null,
): AxiosRequestConfig =>
  token ? { headers: { Authorization: `Bearer ${token}` } } : {}
