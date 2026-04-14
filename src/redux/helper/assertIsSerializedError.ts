import type { SerializedError } from '@reduxjs/toolkit'

export function assertIsSerializedError(
  _error: unknown,
): asserts _error is SerializedError {}
