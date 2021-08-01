import type { DetailedHTMLProps, HTMLAttributes } from 'react'
import React, { memo } from 'react'
import { concatSelecor } from '../utils'

const Button = memo<
  DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
>(
  ({ className, children, ...rest }) => {
    let styles

    if (className) {
      styles = concatSelecor(
        'shadow focus:shadow-outline focus:outline-none font-bold py-2 px-4 rounded',
        className
      )
    }

    return (
      <button className={styles} {...rest}>
        {children}
      </button>
    )
  },
  () => true
)

Button.displayName = 'Button'

export default Button
