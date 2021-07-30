import React from 'react'
import { RouteComponentProps, Link } from '@reach/router'

const Header: React.FC<RouteComponentProps> = () => {
  return (
    <header data-cy="header" className="w-full border-b border-gray-200">
      <div className="h-16 container mx-auto flex sm:flex-row flex-col items-center sm:content-center flex-wrap gap-2 my-4">
        <Link to="/" className="col-auto">
          <h1 className="font-bold text-xl sm:text-2xl">Digital Strength β</h1>
        </Link>
        <p className="text-base text-gray-700 justify-self-start sm:pt-2.5">
          What Today I Learned
          <span className="pl-1" role="img" aria-label="note emoji">
            📝
          </span>
        </p>
        <div className="sm:flex-grow flex sm:justify-end">
          <Link to="/about">
            <div className="hover:text-gray-300 text-lg">about</div>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default React.memo(Header, () => true)
