import React from 'react'
import type { ButtonHTMLAttributes } from 'react'

import ArrowLeft from './icons/ArrowLeft'
import ArrowRight from './icons/ArrowRight'

interface ArrowButtonProps {
  direction: 'left' | 'right'
}

const ArrowButton: React.FC<
  ArrowButtonProps & ButtonHTMLAttributes<HTMLButtonElement>
> = ({ direction, ...rest }) => (
  <button
    className="flex justify-center items-center w-14 h-10 border border-gray-500 rounded disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none"
    {...rest}
  >
    {direction === 'left' && <ArrowLeft />}
    {direction === 'right' && <ArrowRight />}
  </button>
)

export default ArrowButton
