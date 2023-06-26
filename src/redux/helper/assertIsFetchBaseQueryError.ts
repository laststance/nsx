import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

export function assertIsFetchBaseQueryError(
  error: unknown
): asserts error is FetchBaseQueryError {}
