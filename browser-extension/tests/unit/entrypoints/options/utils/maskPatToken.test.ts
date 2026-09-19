import { describe, expect, test } from 'vitest'

import { maskPatToken } from '@/entrypoints/options/utils/maskPatToken'

describe('maskPatToken', () => {
  test('shows only the prefix and the last 4 characters, like the NSX web token list', () => {
    // Arrange
    const rawToken = 'nsx_pat_0123456789abcdef'

    // Act
    const maskedToken = maskPatToken(rawToken)

    // Assert
    expect(maskedToken).toBe('nsx_pat_…cdef')
  })
})
