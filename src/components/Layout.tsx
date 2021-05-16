import React from 'react'
import Header from './Header'

const Layout: React.FC = ({ children }) => {
  return (
    <div className="flex flex-col justify-between w-screen h-screen">
      <Header />
      <main className="container mx-auto flex-grow py-3">{children}</main>
    </div>
  )
}

export default Layout
