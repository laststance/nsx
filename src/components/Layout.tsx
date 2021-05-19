import React from 'react'
import Header from './Header'

interface Props {
  className?: string
}

const Layout: React.FC<Props> = ({ children, className }) => {
  function getContainerStyle(className: Props['className']): string {
    const base = 'container mx-auto flex-grow py-3'

    if (className) {
      return base + ' ' + className
    } else {
      return base
    }
  }

  return (
    <div className="flex flex-col justify-between w-screen h-screen">
      <Header />
      <main className={getContainerStyle(className)}>{children}</main>
    </div>
  )
}

export default Layout
