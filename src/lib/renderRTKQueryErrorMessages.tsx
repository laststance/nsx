import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { ReactElement } from 'react'

import { assertIsFetchBaseQueryError } from './assertIsFetchBaseQueryError'
import { assertIsSerializedError } from './assertIsSerializedError'

function renderRTKQueryErrorMessages(
  error: FetchBaseQueryError | SerializedError
): ReactElement {
  let message: string
  assertIsFetchBaseQueryError(error)
  if (error.status) {
    message = JSON.stringify(error)
  } else {
    assertIsSerializedError(error)
    message = `${error.name}: ${error.message}: ${error.stack}: ${error.code}`
  }
  return <div>${message}</div>
}

export default renderRTKQueryErrorMessages
