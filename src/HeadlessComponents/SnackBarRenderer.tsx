import React from 'react'

import SnackBar from '../components/SnackBar/SnackBar'
import { useAppSelector } from '../redux/hooks'
import { selectMessageQueue } from '../redux/snackbarSlice'

const SnackBarRenderer: React.HeadlessLongicRenderer = React.memo(
  () => {
    const messageQueue = useAppSelector(selectMessageQueue)
    if (messageQueue.length === 0) return null

    const que = messageQueue[0]
    return <SnackBar message={que.message} color={que.color} />
  },
  () => true,
)
SnackBarRenderer.displayName = 'HeadlessComponent.SnackBarDispatcher'

export default SnackBarRenderer
