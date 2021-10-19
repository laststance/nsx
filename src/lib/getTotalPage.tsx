export function getTotalPage(total: number, per_page: number): number {
  return Math.ceil(total / per_page)
}
