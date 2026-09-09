import { describe, expect, test } from 'vitest'

import { isConflictResponse } from '@/entrypoints/popup/utils/isConflictResponse'

describe('isConflictResponse', () => {
  test('shows duplicate feedback for HTTP 409 axios responses', () => {
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

  test('keeps generic failure feedback for non-conflict axios responses', () => {
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
