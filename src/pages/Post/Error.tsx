import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import React, { memo, useEffect } from 'react'

import { useAppDispatch } from '../../redux/hooks'
import { enqueSnackbar } from '../../redux/snackbarSlice'
import { ErrorBoundaryFallbackComponent } from '../../systems/ErrorBoundary'

interface Props {
  error: FetchBaseQueryError | SerializedError | undefined
}

// @TODO replace to render error html rather than snackbar
const Error: React.FC<Props> = memo(
  ({ error }) => {
    const dispatch = useAppDispatch()
    useEffect(() => {
      if (error)
        dispatch(enqueSnackbar({ message: error.toString(), color: 'red' }))
    }, [error])

    return <ErrorBoundaryFallbackComponent />
  },
  () => true
)
Error.displayName = 'Error'

export default Error
