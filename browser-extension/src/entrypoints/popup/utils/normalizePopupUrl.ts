/**
 * Normalizes popup URLs before duplicate checks and save requests run.
 * @param url - The current tab URL.
 * @returns The URL without one trailing slash.
 * @example
 * normalizePopupUrl('https://example.com/') // => 'https://example.com'
 */
export const normalizePopupUrl = (url: string): string => url.replace(/\/$/, '')
