import React, { memo, useState } from 'react'

import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect'
import type { SnackBarMessage } from '../../redux/snackbarSlice'
import { dequeSnackbar } from '../../redux/snackbarSlice'
import { dispatch } from '../../redux/store'

interface Props {
  message: SnackBarMessage['message']
  color: SnackBarMessage['color']
}

const getBGColor = (color: SnackBarMessage['color']): string => {
  if (color === 'blue') {
    return 'bg-blue-700'
  } else if (color === 'red') {
    return 'bg-rose-700'
  }
  return 'bg-green-700'
}

const SnackBar: React.FC<React.PropsWithChildren<Props>> = memo(
  ({ message, color }) => {
    const [opacity, setOpacity] = useState('opacity-0')

    useIsomorphicLayoutEffect(() => {
      setOpacity('opacity-100')

      const timerId = setTimeout(() => {
        setOpacity('opacity-0')
        dispatch(dequeSnackbar())
      }, 3000000000)

      return () => clearTimeout(timerId)
    }, [dispatch])

    return (
      <div data-cy="snackbar" className={`transition-opacity ${opacity}`}>
        {/* Banners: Top Bubble */}
        <div
          className={`z-60 fixed right-0 top-0 m-2 flex items-center justify-between rounded-lg p-4 shadow-lg sm:m-4 ${getBGColor(
            color
          )}`}
        >
          <div className="inline-flex items-center text-teal-50">
            <p className="text-sm font-medium">{message}</p>
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
        {/* END Banners: Top Bubble */}

        {/* Placeholder */}
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-32 text-center text-lg text-gray-500 dark:border-gray-700 dark:bg-gray-700/25">
          Content
        </div>
      </div>
    )
  },
  () => true
)
SnackBar.displayName = 'SnackBar'

export default SnackBar
