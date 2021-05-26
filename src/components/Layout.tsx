import React from 'react'
import Header from './Header'
import Footer from './Footer'

interface Props {
  className?: string
}

function getContainerStyle(className: Props['className']): string {
  const base = 'container mx-auto flex-grow py-3'

  if (className) {
    return base + ' ' + className
  } else {
    return base
  }
}

const Layout: React.FC<Props> = ({ children, className }) => {
  return (
    <div className="flex flex-col justify-between w-screen h-screen">
      <Header />
      <main className={getContainerStyle(className)}>{children}</main>
      <Footer />
    </div>
  )
}

export default React.memo<React.PropsWithChildren<Props>>(Layout)
