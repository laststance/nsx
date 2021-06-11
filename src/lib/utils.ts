// pass one time class selector to base component
export function concatSelecor(
  classNames1: string,
  classNames2: string
): string {
  return classNames1 + ' ' + classNames2
}

//
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  })
}
