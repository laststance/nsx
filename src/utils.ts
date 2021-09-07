// import { FetchBaseQueryError } from '@reduxjs/toolkit/src/query/fetchBaseQuery'

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

export function truncateString(str: string, num: number): string {
  // If the length of str is less than or equal to num
  // just return str--don't truncate it.
  if (str.length <= num) {
    return str
  }
  // Return str truncated with '...' concatenated to the end of str.
  return str.slice(0, num) + '...'
}

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

const NODE_ENV = process.env.NODE_ENV

export const invariant = function (
  /* eslint-disable @typescript-eslint/explicit-module-boundary-types */
  condition: any,
  format: string,
  a?: any,
  b?: any,
  c?: any,
  d?: any,
  e?: any,
  f?: any
): void {
  /* eslint-enable @typescript-eslint/explicit-module-boundary-types */
  if (NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument')
    }
  }

  if (!condition) {
    let error
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
          'for the full error message and additional helpful warnings.'
      )
    } else {
      const args = [a, b, c, d, e, f]
      let argIndex = 0
      error = new Error(
        format.replace(/%s/g, function () {
          return args[argIndex++]
        })
      )
      error.name = 'Invariant Violation'
    }

    // @ts-ignore
    error.framesToPop = 1 // we don't care about invariant's own frame
    throw error
  }
}

// @TODO create FetchBaseQueryError handler
