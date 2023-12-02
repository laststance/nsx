import React from 'react'

import SnackBar from '../components/SnackBar/SnackBar'
import SnackBarContainer from '../components/SnackBar/SnackBarContainer'
import { useAppSelector } from '../redux/hooks'
import { selectMessageQueue } from '../redux/snackbarSlice'

const SnackBarRenderer: React.FC = React.memo(
  () => {
    const messageQueue = useAppSelector(selectMessageQueue)
    if (messageQueue.length === 0) return null

    return (
      <SnackBarContainer>
        {messageQueue.map((que) => (
          <SnackBar
            key={que.id}
            message={que.message}
            color={que.color}
            id={que.id}
          />
        ))}
      </SnackBarContainer>
    )
  },
  () => true,
)
SnackBarRenderer.displayName = 'SnackBarRenderer'

export default SnackBarRenderer
