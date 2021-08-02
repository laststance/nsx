// pass one time class selector to base component
export function concatSelecor(
  classNames1: string,
  classNames2: string
): string {
  return classNames1 + ' ' + classNames2
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  })
}

export function truncateString(str: string, num: number): string {
  // If the length of str is less than or equal to num
  // just return str--don't truncate it.
  if (str.length <= num) {
    return str
  }
  // Return str truncated with '...' concatenated to the end of str.
  return str.slice(0, num) + '...'
}
