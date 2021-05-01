import React from 'react'

const Layout: React.FC = ({ children }) => {
  return (
    <div className="flex flex-col justify-between w-screen h-screen">
      {children}
    </div>
  )
}

export default Layout
