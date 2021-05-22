import React from 'react'
import { useSelector } from 'react-redux'
import { ReduxState } from '../redux'
import SnackBar from './SnackBar'

const SnackBarSystem: React.FC = ({ children }) => {
  const messageQueue = useSelector<ReduxState, ReduxState['snackbarQueue']>(
    (state) => state.snackbarQueue
  )
  if (messageQueue.length === 0) return <>{children}</>

  const message = messageQueue[0]

  return (
    <>
      <SnackBar message={message} />
      {children}
    </>
  )
}

export default SnackBarSystem
