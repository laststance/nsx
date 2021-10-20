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
    className="w-14 disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none hover:text-gray-400 hover:border-gray-200 hover:bg-gray-100 flex items-center justify-center h-10 border border-gray-500 rounded"
    {...rest}
  >
    {direction === 'left' && <ArrowLeft />}
    {direction === 'right' && <ArrowRight />}
  </button>
)
export default ArrowButton
