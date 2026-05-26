import axios from 'axios'

/**
 * Detects duplicate stock responses without depending on backend message text.
 * @param error - The unknown error value thrown by axios.
 * @returns Whether the backend responded with HTTP 409 Conflict.
 * @example
 * isConflictResponse(error) // => true
 */
export const isConflictResponse = (error: unknown): boolean => {
  return axios.isAxiosError(error) && error.response?.status === 409
}
