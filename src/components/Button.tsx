import React, { PropsWithChildren } from 'react'
import { concatSelecor } from '../utils'

interface Props {
  className?: string
}

const Button: React.FC<Props> = ({ className, children }) => {
  let styles

  if (className) {
    styles = concatSelecor(
      'shadow focus:shadow-outline focus:outline-none font-bold py-2 px-4 rounded',
      className
    )
  }

  return <button className={styles}>{children}</button>
}

export default React.memo<PropsWithChildren<Props>>(Button)
