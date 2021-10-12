import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

class AssertionError extends Error {
  name = 'AssertionError'
}

export function assertIsFetchBaseQueryError(
  error: unknown
): asserts error is FetchBaseQueryError {
  switch (true) {
    case 'object' === typeof error:
    // @TODO
    default:
      throw new AssertionError(
        `Expected 'val' to be FetchBaseQueryError, but received ${error}`
      )
  }
}
