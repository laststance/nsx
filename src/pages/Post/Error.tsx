import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import React, { memo, useEffect } from 'react'

import { ErrorBoundaryFallbackComponent } from '../../components/ErrorBoundary/ErrorBoundary'
import { enqueSnackbar } from '../../redux/snackbarSlice'
import { dispatch } from '../../redux/store'

interface Props<T extends Error> {
  error?: T | FetchBaseQueryError | SerializedError | undefined
}

// @TODO replace to render error html rather than snackbar
const Error: React.FC<React.PropsWithChildren<Props<any>>> = memo(
  ({ error }) => {
    useEffect(() => {
      if (error)
        dispatch(enqueSnackbar({ color: 'red', message: error.toString() }))
      // @TODO Sentry
    }, [error])

    return <ErrorBoundaryFallbackComponent />
  },
  () => true
)
Error.displayName = 'Error'

export default Error
