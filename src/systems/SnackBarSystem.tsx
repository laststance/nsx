import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DequeueSnackbarAction, ReduxState } from '../redux'
import { SnackBarMessage } from '../../DataStructure'
import { Dispatch } from 'redux'

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

interface Props {
  message: SnackBarMessage
}

const SnackBar: React.FC<Props> = ({ message }) => {
  const dispatch: Dispatch<DequeueSnackbarAction> = useDispatch()
  useEffect(() => {
    setTimeout(
      () => dispatch({ type: 'DEQUEUE_SNACKBAR_MESSAGE' }),
      9000000000000000000000
    )
  }, [dispatch])
  return (
    <div className="z-10 absolute bg-green-400 w-40 h-24">
      <p>{message}</p>
    </div>
  )
}

export default SnackBarSystem
