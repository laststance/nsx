/** IANA timezone used for post dates (matches server/CI default in ansible and test.yml). */
const DISPLAY_TIMEZONE = 'Asia/Tokyo'

/**
 * Formats an ISO date string for display in the post list (MM/DD/YY in Asia/Tokyo).
 *
 * @param dateString - ISO 8601 timestamp from the API
 * @returns Locale date string, e.g. `07/16/21`
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    timeZone: DISPLAY_TIMEZONE,
  })
}
