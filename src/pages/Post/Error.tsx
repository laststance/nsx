import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import * as Sentry from '@sentry/react'
import React, { memo } from 'react'

import { ErrorBoundaryFallbackComponent } from '../../components/ErrorBoundary'
import { useIsomorphicEffect } from '../../hooks/useIsomorphicEffect'
import { enqueSnackbar } from '../../redux/snackbarSlice'
import { dispatch } from '../../redux/store'

interface Props<T extends Error> {
  error?: T | FetchBaseQueryError | SerializedError | undefined
}

const Error: React.FC<React.PropsWithChildren<Props<any>>> = memo(
  ({ error }) => {
    useIsomorphicEffect(() => {
      if (error) {
        Sentry.captureException(error)
        dispatch(enqueSnackbar({ color: 'red', message: error.toString() }))
      }
    }, [error])

    return <ErrorBoundaryFallbackComponent />
  },
  () => true,
)
Error.displayName = 'Error'

export default Error
