import React, { useEffect, useState } from 'react'
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
  const [opacity, setOpacity] = useState('opacity-0')
  useEffect(() => {
    setOpacity('opacity-100')

    const timerId = setTimeout(() => {
      setOpacity('opacity-0')
      dispatch({ type: 'DEQUEUE_SNACKBAR_MESSAGE' })
    }, 3000)

    return () => clearTimeout(timerId)
  }, [dispatch])

  return (
    <div
      className={`flex justify-center items-center z-10 py-2 px-4 absolute bg-green-500 top-10 right-10 rounded-xl button transition-opacity ${opacity}`}
    >
      <p className="text-white text-lg uppercase font-medium">{message}</p>
    </div>
  )
}

export default SnackBarSystem
