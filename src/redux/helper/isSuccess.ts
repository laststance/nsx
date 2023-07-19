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
    if (res.error === null) return true
    if (JSON.stringify(res.error) === '{}') return true
    const error = res.error
    if (error) {
      // @TODO Sentry
      // @TODO Error Modal with Json Indent
      store.dispatch(
        enqueSnackbar({ color: 'red', message: JSON.stringify(error) }),
      )
      return false
    }
    return true
  } else {
    return false
  }
}

export default isSuccess
