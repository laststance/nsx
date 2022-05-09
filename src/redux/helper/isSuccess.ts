import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

import { enqueSnackbar } from '../snackbarSlice'
import { store } from '../store'

interface Response {
  data?: unknown
  error?: SerializedError | FetchBaseQueryError
}

/**
 * RTKQuery mutation error handler
 * @param res
 */
const isSuccess = (res: Response): boolean => {
  if ('data' in res && res.data) return true
  if ('error' in res === false) return true
  if ('error' in res) {
    if (res.error === undefined) return true
    const error = res.error
    // "status" fiels only exists in a FetchBaseQueryError
    if ('status' in error) {
      // @TODO Sentry
      // FetchBaseQueryError
      store.dispatch(
        enqueSnackbar({ color: 'red', message: JSON.stringify(error) })
      )
      return false
    } else {
      // @TODO Sentry
      // SerializedError
      store.dispatch(
        enqueSnackbar({ color: 'red', message: JSON.stringify(error) })
      )
      return false
    }
  }
  return true
}

export default isSuccess
