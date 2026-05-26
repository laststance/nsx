import { describe, expect, it } from 'vitest'

import { isConflictResponse } from '@/entrypoints/popup/utils/isConflictResponse'

describe('isConflictResponse', () => {
  it('shows duplicate feedback for HTTP 409 axios responses', () => {
    // Arrange
    const error = {
      isAxiosError: true,
      response: { status: 409 },
    }

    // Act
    const isDuplicateResponse = isConflictResponse(error)

    // Assert
    expect(isDuplicateResponse).toBe(true)
  })

  it('keeps generic failure feedback for non-conflict axios responses', () => {
    // Arrange
    const error = {
      isAxiosError: true,
      response: { status: 500 },
    }

    // Act
    const isDuplicateResponse = isConflictResponse(error)

    // Assert
    expect(isDuplicateResponse).toBe(false)
  })
})
