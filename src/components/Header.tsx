import React from 'react'
import { RouteComponentProps, Link } from '@reach/router'

const Header: React.FC<RouteComponentProps> = () => {
  return (
    <header data-cy="header" className="w-full border-b border-gray-200">
      <div className="container mx-auto flex items-center content-center gap-2 my-4">
        <Link to="/" className="col-auto">
          <h1 className="font-bold text-2xl">Digital Strength β</h1>
        </Link>
        <p className="text-base text-gray-500 justify-self-start">
          Just putting Today I Learned
        </p>
        <div className="flex-grow flex justify-end">
          <Link to="/about">
            <div className="hover:text-gray-300">about</div>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default React.memo(Header)
