import clsx from 'clsx'
import type { ButtonHTMLAttributes } from 'react'
import React, { memo } from 'react'

import Spinner from '../Spinner/Spinner'

const variants = {
  danger: 'bg-red-500 text-white hover:bg-red-600',
  inverse:
    'bg-white text-green-400 border border-green-400 hover:bg-green-500 hover:text-white',
  primary: 'bg-green-500 hover:bg-green-600 text-white',
  secondary: 'bg-blue-500 hover:bg-blue-600 text-white',
}

const sizes = {
  lg: 'py-3 px-8 text-lg',
  md: 'py-2 px-6 text-md',
  sm: 'py-2 px-4 text-sm',
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean
  size?: keyof typeof sizes
  variant?: keyof typeof variants
}

const Button: React.FC<React.PropsWithChildren<ButtonProps>> = memo(
  ({
    children,
    className = '',
    isLoading = false,
    size = 'md',
    type = 'button',
    variant = 'primary',
    ...rest
  }) => {
    const base =
      'flex justify-center items-center shadow rounded disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none font-semibold'

    return (
      <button
        type={type}
        className={clsx(base, className, variants[variant], sizes[size])}
        {...rest}
      >
        {isLoading ? <Spinner size="sm" className="text-current" /> : null}
        <span className="mx-2">{children}</span>
      </button>
    )
  },
)
Button.displayName = 'Button'

export default Button
