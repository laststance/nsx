import React from 'react'

import SnackBar from '../components/SnackBar/SnackBar'
import SnackBarContainer from '../components/SnackBar/SnackBarContainer'
import { useAppSelector } from '../redux/hooks'
import { selectMessageQueue } from '../redux/snackbarSlice'

const SnackBarRenderer: React.HeadlessComponent = React.memo(
  () => {
    const messageQueue = useAppSelector(selectMessageQueue)
    if (messageQueue.length === 0) return null

    return (
      <SnackBarContainer>
        {messageQueue.map((que, i) => (
          <SnackBar key={i} message={que.message} color={que.color} />
        ))}
      </SnackBarContainer>
    )
  },
  () => true,
)
SnackBarRenderer.displayName = 'HeadlessComponent.SnackBarDispatcher'

export default SnackBarRenderer
