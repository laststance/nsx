import type { ButtonHTMLAttributes } from 'react'
import React, { memo } from 'react'
import clsx from 'clsx'

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
}

const Button = memo<ButtonProps>(
  ({
    type = 'button',
    variant = 'primary',
    size = 'md',
    children,
    ...rest
  }) => {
    const base =
      'shadow focus:shadow-outline focus:outline-none font-semibold rounded'

    return (
      <button
        type={type}
        className={clsx(base, variants[variant], sizes[size])}
        {...rest}
      >
        {children}
      </button>
    )
  },
  () => true
)

Button.displayName = 'Button'

export default Button
