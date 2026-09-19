/**
 * Shortens the current tab URL to the domain shown beside the favicon in the popup's status slot.
 * @param url - The current tab URL.
 * @returns
 * - For http(s) pages: the hostname without a leading `www.`
 * - For anything else (`chrome://`, `file://`, blank, unparsable): an empty string
 * @example
 * getDisplayDomain('https://www.example.com/articles/1') // => 'example.com'
 * getDisplayDomain('chrome://extensions/')                // => ''
 */
export const getDisplayDomain = (url: string): string => {
  if (!URL.canParse(url)) return ''

  const { hostname, protocol } = new URL(url)
  // Only web pages can be saved, so browser-internal and local pages show no domain.
  if (protocol !== 'https:' && protocol !== 'http:') return ''

  return hostname.replace(/^www\./, '')
}
