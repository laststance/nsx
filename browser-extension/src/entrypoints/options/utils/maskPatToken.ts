/**
 * Masks the stored PAT for display on the Options page, in the same form the NSX web settings list uses, so the owner can match the two.
 * @param token - The raw `nsx_pat_…` token.
 * @returns The token reduced to its prefix and last 4 characters.
 * @example
 * maskPatToken('nsx_pat_0123456789abcdef') // => 'nsx_pat_…cdef'
 */
export const maskPatToken = (token: string): `nsx_pat_…${string}` =>
  `nsx_pat_…${token.slice(-4)}`
