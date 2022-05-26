import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import React, { memo } from 'react'

import { assertIsFetchBaseQueryError } from '../../redux/helper/assertIsFetchBaseQueryError'
import { assertIsSerializedError } from '../../redux/helper/assertIsSerializedError'

interface Props {
  error: FetchBaseQueryError | SerializedError
}

const RTKQueryErrorMessages: React.FC<React.PropsWithChildren<Props>> = memo(
  ({ error }) => {
    let message: string
    assertIsFetchBaseQueryError(error)
    if (error.status) {
      message = JSON.stringify(error)
    } else {
      assertIsSerializedError(error)
      message = `${error.name}: ${error.message}: ${error.stack}: ${error.code}`
    }
    return <code>{message}</code>
  },
  () => true
)
RTKQueryErrorMessages.displayName = 'RTKQueryErrorMessages'

export default RTKQueryErrorMessages
