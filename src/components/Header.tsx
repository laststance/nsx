import React from 'react'
import { RouteComponentProps } from '@reach/router'
import { Link } from '@reach/router'

const Header: React.FC<RouteComponentProps> = () => {
  return (
    <header data-cy="header" className="w-full border-b border-gray-200">
      <div className="container mx-auto grid grid-cols-3 grid-rows-1 gap-4 content-center items-center my-4">
        <Link to="/">
          <h1 className="font-bold text-2xl">Digital Strength β</h1>
        </Link>
        <p className="text-base text-gray-500">Just putting Today I Learned</p>
        <div className="justify-end flex justify-end">
          <Link to="/about">
            <div className="hover:text-gray-300">about</div>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default React.memo(Header)
