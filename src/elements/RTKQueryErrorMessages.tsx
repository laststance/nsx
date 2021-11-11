import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import React, { memo } from 'react'

import { assertIsFetchBaseQueryError } from '../lib/assertIsFetchBaseQueryError'
import { assertIsSerializedError } from '../lib/assertIsSerializedError'

interface Props {
  error: FetchBaseQueryError | SerializedError
}

const RTKQueryErrorMessages: React.FC<Props> = memo((error) => {
  let message: string
  assertIsFetchBaseQueryError(error)
  if (error.status) {
    message = JSON.stringify(error)
  } else {
    assertIsSerializedError(error)
    message = `${error.name}: ${error.message}: ${error.stack}: ${error.code}`
  }
  return <div>{message}</div>
})
RTKQueryErrorMessages.displayName = 'RTKQueryErrorMessages'

export default RTKQueryErrorMessages
