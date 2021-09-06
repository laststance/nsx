import clsx from 'clsx'
import type { ButtonHTMLAttributes } from 'react'
import React, { memo } from 'react'

import { InnterSpiner } from './InnerSpiner'

const variants = {
  primary: 'bg-green-500 hover:bg-green-600 text-white',
  secondary: 'bg-blue-500 hover:bg-blue-600 text-white',
  inverse:
    'bg-white text-green-400 border border-green-400 hover:bg-green-500 hover:text-white',
  danger: 'bg-red-500 text-white hover:bg-red-600',
}

const sizes = {
  sm: 'py-2 px-4 text-sm',
  md: 'py-2 px-6 text-md',
  lg: 'py-3 px-8 text-lg',
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  isLoading?: boolean
}

const Button: React.FC<ButtonProps> = memo(
  ({
    type = 'button',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    children,
    className = '',
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
        {isLoading && <InnterSpiner size="sm" className="text-current" />}
        <span className="mx-2">{children}</span>
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
