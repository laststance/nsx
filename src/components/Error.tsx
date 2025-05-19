import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import * as Sentry from '@sentry/react'
import React, { memo } from 'react'

import { ErrorBoundaryFallbackComponent } from '@/src/components/ErrorBoundary'
import { useIsomorphicEffect } from '@/src/hooks/useIsomorphicEffect'
import { enqueSnackbar } from '@/src/redux/snackbarSlice'
import { dispatch } from '@/src/redux/store'

interface Props<T extends Error> {
  error?: T | FetchBaseQueryError | SerializedError | undefined
}

export const AppError: React.FC<React.PropsWithChildren<Props<any>>> = memo(
  ({ error }) => {
    useIsomorphicEffect(() => {
      if (error) {
        Sentry.captureException(error)
        dispatch(
          enqueSnackbar({
            color: 'red',
            message: JSON.stringify(error, null, 2),
          }),
        )
      }
    }, [error])

    return <ErrorBoundaryFallbackComponent />
  },
  () => true,
)
Error.displayName = 'Error'
