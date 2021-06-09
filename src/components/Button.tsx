import React, { PropsWithChildren } from 'react'
import { concatSelecor } from '../utils'

interface Props {
  className?: string
  /* eslint-disable-next-line */
  onClick?: any
}

const Button: React.FC<Props> = ({ className, children, ...rest }) => {
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
}

export default React.memo<PropsWithChildren<Props>>(Button)
