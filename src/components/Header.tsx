import React from 'react'
import { RouteComponentProps } from '@reach/router'
import { Link } from '@reach/router'

const Header: React.FC<RouteComponentProps> = () => {
  return (
    <header data-cy="header" className="w-full border-b border-gray-200">
      <div className="container mx-auto">
        <Link to="/">
          <h1 className="font-bold text-2xl">Digital Strength</h1>
        </Link>
        <span className="text-sm text-gray-500">beyond the money</span>
      </div>
    </header>
  )
}

export default React.memo(Header)
