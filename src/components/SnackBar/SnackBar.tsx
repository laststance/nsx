import React, { memo, useEffect, useState } from 'react'

import type { SnackBarMessage } from '../../redux/snackbarSlice'
import { dequeSnackbar } from '../../redux/snackbarSlice'
import { dispatch } from '../../redux/store'

interface Props {
  message: SnackBarMessage['message']
  color: SnackBarMessage['color']
}

const SnackBar: React.FC<React.PropsWithChildren<Props>> = memo(
  ({ message, color }) => {
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
        data-cy="snackbar"
        className={`flex max-w-xl items-center justify-center ${bgColor(
          color
        )} button absolute top-10 right-10 z-10 rounded-xl py-2 px-4 transition-opacity ${opacity}`}
      >
        <p className="text-lg font-medium uppercase text-white">{message}</p>
      </div>
    )
  },
  () => true
)
SnackBar.displayName = 'SnackBar'

export default SnackBar
