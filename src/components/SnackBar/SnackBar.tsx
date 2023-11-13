import React, { memo, useState } from 'react'

import { useIsomorphicEffect } from '../../hooks/useIsomorphicEffect'
import type { SnackBarMessage } from '../../redux/snackbarSlice'
import { dequeSnackbar } from '../../redux/snackbarSlice'
import { dispatch } from '../../redux/store'

interface Props {
  // id: SnackBarMessage['id']
  color: SnackBarMessage['color']
  message: SnackBarMessage['message']
}

const getBGColor = (color: SnackBarMessage['color']): string => {
  if (color === 'green') {
    return 'bg-teal-700'
  } else if (color === 'red') {
    return 'bg-rose-700'
  }
  return 'bg-green-700'
}

const SnackBar: React.FC<React.PropsWithChildren<Props>> = memo(
  ({ color, message }) => {
    const [opacity, setOpacity] = useState('opacity-0')

    useIsomorphicEffect(() => {
      setOpacity('opacity-100')

      const timer1Id = setTimeout(() => {
        setOpacity('opacity-0')
      }, 4000)
      const timer2Id = setTimeout(() => {
        dispatch(dequeSnackbar())
      }, 5000)

      return () => {
        clearTimeout(timer2Id)
        clearTimeout(timer1Id)
      }
    }, [])

    return (
      <div
        data-cy="snackbar"
        className={`flex items-center justify-between rounded-lg p-4 shadow-lg sm:m-4 ${getBGColor(
          color,
        )} ${opacity} transition-opacity duration-1000 ease-out`}
      >
        <div className="inline-flex items-center text-teal-50">
          <p className="text-lg font-medium uppercase text-white">{message}</p>
        </div>
        <div className="ml-2 flex items-center">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded p-1 text-white opacity-75 hover:opacity-100 focus:outline-none focus:ring focus:ring-gray-500 focus:ring-opacity-25 active:opacity-75"
          >
            <svg
              className="hi-solid hi-x inline-block h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    )
  },
)
SnackBar.displayName = 'SnackBar'

export default SnackBar
