import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

import { enqueSnackbar } from '../redux/snackbarSlice'
import { store } from '../redux/store'

interface Response {
  data?: unknown
  error?: SerializedError | FetchBaseQueryError
}

const mutationErrorHandler = (res: Response): void => {
  if ('error' in res === false) return
  if ('data' in res && res.data) return
  if ('error' in res) {
    if (res.error === undefined) return
    const error = res.error
    // "status" fiels only exists in a FetchBaseQueryError
    if ('status' in error) {
      let message: string
      if (typeof error.status === 'number') {
        message = error.status.toString()
      } else {
        message = error.status
      }
      store.dispatch(enqueSnackbar({ message: message, color: 'red' }))
      return
    } else {
      // SerializedError
      store.dispatch(
        enqueSnackbar({ message: JSON.stringify(error), color: 'red' })
      )
    }
  }
}

export default mutationErrorHandler
