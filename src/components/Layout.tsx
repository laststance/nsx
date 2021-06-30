import React from 'react'
import Header from './Header'
import Footer from './Footer'
import { concatSelecor } from '../lib/utils'

interface Props {
  className?: string
}

const Layout: React.FC<Props> = ({ children, className, ...props }) => {
  let containerStyle = 'container mx-auto flex-grow py-3'
  if (className) {
    containerStyle = concatSelecor(containerStyle, className)
  }

  return (
    <div className="flex flex-col justify-between w-screen h-screen" {...props}>
      <Header />
      <main className={containerStyle}>{children}</main>
      <Footer />
    </div>
  )
}

export default React.memo<React.PropsWithChildren<Props>>(Layout)
