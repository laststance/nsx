// pass one time class selector to base component
export function concatSelecor(
  classNames1: string,
  classNames2: string
): string {
  return classNames1 + ' ' + classNames2
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  })
}

export function truncateString(str: string | undefined, num: number): string {
  if (str === undefined) return ''
  // If the length of str is less than or equal to num
  // just return str--don't truncate it.
  if (str.length <= num) {
    return str
  }
  // Return str truncated with '...' concatenated to the end of str.
  return str.slice(0, num) + '...'
}

class AssertionError extends Error {
  name = 'AssertionError'
}

export function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new AssertionError(
      `Expected 'val' to be defined, but received ${val}`
    )
  }
}

// from https://github.com/reduxjs/react-redux/blob/7a3e2fd11c9898e28700cad963757b523e215ab4/src/utils/shallowEqualScalar.js
export default function shallowEqualScalar(
  objA: Record<string, Primitive>,
  objB: Record<string, Primitive>
): boolean {
  if (objA === objB) {
    return true
  }

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) {
    return false
  }

  // Test for A's keys different from B.
  const hasOwn = Object.prototype.hasOwnProperty
  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i])) {
      return false
    }

    const valA = objA[keysA[i]]
    const valB = objB[keysA[i]]

    if (valA !== valB || typeof valA === 'object' || typeof valB === 'object') {
      return false
    }
  }

  return true
}
