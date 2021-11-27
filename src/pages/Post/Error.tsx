import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type React from 'react'
import { memo, useEffect } from 'react'

import { enqueSnackbar } from '../../redux/snackbarSlice'
import type { AppDispatch } from '../../redux/store'

interface Props {
  dispatch: AppDispatch
  error: FetchBaseQueryError | SerializedError | undefined
}

// @TODO replace to render error html rather than snackbar
const Error: React.FC<Props> = memo(
  ({ dispatch, error }) => {
    useEffect(() => {
      if (error)
        dispatch(enqueSnackbar({ message: error.toString(), color: 'red' }))
    }, [error])

    return null
  },
  () => true
)
Error.displayName = 'Error'

export default Error
