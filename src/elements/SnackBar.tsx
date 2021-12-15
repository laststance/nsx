import React, { memo, useEffect, useState } from 'react'

import { useAppDispatch } from '../redux/hooks'
import type { SnackBarMessage } from '../redux/snackbarSlice'
import { dequeSnackbar } from '../redux/snackbarSlice'

interface Props {
  message: SnackBarMessage['message']
  color: SnackBarMessage['color']
}

const SnackBar: React.FC<Props> = memo(
  ({ message, color }) => {
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
        dispatch(dequeSnackbar())
      }, 3000)

      return () => clearTimeout(timerId)
    }, [dispatch])

    return (
      <div
        className={`max-w-xl flex justify-center items-center ${bgColor(
          color
        )} z-10 py-2 px-4 absolute top-10 right-10 rounded-xl button transition-opacity ${opacity}`}
      >
        <p className="text-lg font-medium text-white uppercase">{message}</p>
      </div>
    )
  },
  () => true
)
SnackBar.displayName = 'SnackBar'

export default SnackBar
