import React, { memo } from 'react'
import { Link } from 'react-router-dom'

import Github from '../elements/icons/Github'

const Header = memo(
  () => (
    <header data-cy="header" className="w-full border-b border-gray-200">
      <div className="sm:flex-row sm:content-center container flex flex-col flex-wrap items-center h-16 gap-2 mx-auto my-4">
        <Link to="/" className="col-auto" data-cy="blog-title-top-page-link">
          <h1 className="sm:text-2xl text-xl font-bold">Today I Learned</h1>
        </Link>
        <p className="text-base text-gray-700 justify-self-start sm:pt-2.5 sm:pl-1.5">
          What Today I Learned
          <span className="pl-1" role="img" aria-label="note emoji">
            📝
          </span>
        </p>
        <div className="sm:flex-grow sm:justify-end flex space-x-2">
          <Link to="/about">
            <div className="hover:text-gray-300 text-lg">about</div>
          </Link>
          <a
            href="https://github.com/laststance/nsx"
            target="_blank"
            rel="noreferrer"
          >
            <Github />
          </a>
        </div>
      </div>
    </header>
  ),
  () => true
)
Header.displayName = 'Header'

export default Header
