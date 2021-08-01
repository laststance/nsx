import React, { useEffect, useState } from 'react'
import type { SnackBarMessage } from '../../types'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { selectMessageQueue, deque } from '../redux/snackbarSlice'

const SnackBarSystem = React.memo(
  () => {
    const messageQueue = useAppSelector(selectMessageQueue)
    if (messageQueue.length === 0) return null

    const que = messageQueue[0]
    return <SnackBar message={que.message} color={que.color} />
  },
  () => true
)

export default SnackBarSystem

interface Props {
  message: SnackBarMessage['message']
  color: SnackBarMessage['color']
}

const SnackBar: React.FC<Props> = ({ message, color }) => {
  const dispatch = useAppDispatch()
  const [opacity, setOpacity] = useState('opacity-0')
  const bgColor = (color: string): string => {
    if (color === 'green') {
      return 'bg-green-500'
    } else if (color === 'red') {
      return 'bg-red-500'
    }
    return 'bg-green-500'
  }

  useEffect(() => {
    setOpacity('opacity-100')

    const timerId = setTimeout(() => {
      setOpacity('opacity-0')
      dispatch(deque())
    }, 3000)

    return () => clearTimeout(timerId)
  }, [dispatch])

  return (
    <div
      className={`flex justify-center items-center ${bgColor(
        color
      )} z-10 py-2 px-4 absolute top-10 right-10 rounded-xl button transition-opacity ${opacity}`}
    >
      <p className="text-white text-lg uppercase font-medium">{message}</p>
    </div>
  )
}
