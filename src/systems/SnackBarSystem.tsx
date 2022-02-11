import React from 'react'

import SnackBar from '../components/SnackBar'
import { useAppSelector } from '../redux/hooks'
import { selectMessageQueue } from '../redux/snackbarSlice'

const SnackBarSystem = React.memo(
  () => {
    const messageQueue = useAppSelector(selectMessageQueue)
    if (messageQueue.length === 0) return null

    const que = messageQueue[0]
    return <SnackBar message={que.message} color={que.color} />
  },
  () => true
)
SnackBarSystem.displayName = 'SnackBarSystem'

export default SnackBarSystem
