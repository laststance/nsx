import type { SerializedError } from '@reduxjs/toolkit'

export function assertIsSerializedError(
  error: unknown
): asserts error is SerializedError {}
