import axios from 'axios'

/**
 * Detects a 401 from the stock API so a rejected stored PAT can trigger the reconnect prompt.
 * @param error - The unknown error value thrown by axios.
 * @returns Whether the backend responded with HTTP 401 Unauthorized.
 * @example
 * isUnauthorizedResponse(error) // => true
 */
export const isUnauthorizedResponse = (error: unknown): boolean => {
  return axios.isAxiosError(error) && error.response?.status === 401
}
