import React, { memo } from 'react'
import type { ButtonHTMLAttributes } from 'react'

import ArrowLeft from '../icons/ArrowLeft'
import ArrowRight from '../icons/ArrowRight'

interface ArrowButtonProps {
  direction: 'left' | 'right'
}

const ArrowButton: React.FC<
  ArrowButtonProps & ButtonHTMLAttributes<HTMLButtonElement>
> = memo(({ direction, ...rest }) => (
  <button
    className="flex h-10 w-14 items-center justify-center rounded-sm border border-gray-500 bg-white hover:border-gray-200 hover:bg-gray-100 hover:text-gray-400 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-30"
    {...rest}
  >
    {direction === 'left' ? <ArrowLeft /> : null}
    {direction === 'right' ? <ArrowRight /> : null}
  </button>
))
ArrowButton.displayName = 'ArrowButton'

export default ArrowButton
