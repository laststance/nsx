import type { MiddlewareAPI, Middleware } from '@reduxjs/toolkit'
import { isRejectedWithValue } from '@reduxjs/toolkit'

/**
 * Log a warning and show a toast!
 */
export const SerializedErrorHandlingMiddleware: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these use matchers!
    if (isRejectedWithValue(action)) {
      // eslint-disable-next-line no-console
      console.warn('We got a rejected action!', api)
      // eslint-disable-next-line no-console
      console.log(action, next)
    }

    return next(action)
  }
