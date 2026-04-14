import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export function assertIsFetchBaseQueryError(
  _error: unknown,
): asserts _error is FetchBaseQueryError {}
