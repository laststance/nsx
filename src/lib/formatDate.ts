export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  })
}
