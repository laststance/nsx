class AssertionError extends Error {
  name = 'AssertionError'
}

export function assertIsError<T extends Error>(
  error: unknown
): asserts error is T {
  if (error instanceof Error === false) {
    throw new AssertionError(
      `Expected 'val' to be Error, but received ${error}`
    )
  }
}
