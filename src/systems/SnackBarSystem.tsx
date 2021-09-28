import React from 'react'
import type { AllHTMLAttributes } from 'react'

import { SnackBar } from '../elements/SnackBar'
import { useAppSelector } from '../redux/hooks'
import { selectMessageQueue } from '../redux/snackbarSlice'

const SnackBarSystem = React.memo<AllHTMLAttributes<HTMLDivElement>>(
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
