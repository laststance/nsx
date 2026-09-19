/**
 * Keeps only favicon URLs the popup can actually load, so an `<img>` never points at a browser-internal icon.
 * @param favIconUrl - The `favIconUrl` Chrome reports for the current tab, if any.
 * @returns
 * - For `https:`, `http:` and `data:image/` icons: the URL unchanged
 * - For anything else (`chrome://…`, missing): an empty string, which makes the status slot draw its globe icon
 * @example
 * getLoadableFaviconUrl('https://example.com/favicon.ico') // => 'https://example.com/favicon.ico'
 * getLoadableFaviconUrl('chrome://theme/IDR_EXTENSIONS_FAVICON') // => ''
 * getLoadableFaviconUrl(undefined) // => ''
 */
export const getLoadableFaviconUrl = (
  favIconUrl: string | undefined,
): string => {
  if (!favIconUrl) return ''

  return /^(https?:|data:image\/)/.test(favIconUrl) ? favIconUrl : ''
}
