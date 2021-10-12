import { Link } from '@reach/router'
import React, { memo } from 'react'

import GithubIcon from '../elements/GithubIcon'

const Header = memo(
  () => (
    <header data-cy="header" className="w-full border-b border-gray-200">
      <div className="h-16 container mx-auto flex sm:flex-row flex-col items-center sm:content-center flex-wrap gap-2 my-4">
        <Link to="/" className="col-auto" data-cy="blog-title-top-page-link">
          <h1 className="font-bold text-xl sm:text-2xl">Today I Learned β</h1>
        </Link>
        <p className="text-base text-gray-700 justify-self-start sm:pt-2.5 sm:pl-1.5">
          What Today I Learned
          <span className="pl-1" role="img" aria-label="note emoji">
            📝
          </span>
        </p>
        <div className="sm:flex-grow flex space-x-2 sm:justify-end">
          <Link to="/about">
            <div className="hover:text-gray-300 text-lg">about</div>
          </Link>
          <a
            href="https://github.com/laststance/today-i-learned"
            target="_blank"
            rel="noreferrer"
          >
            <GithubIcon />
          </a>
        </div>
      </div>
    </header>
  ),
  () => true
)

Header.displayName = 'Header'

export default Header
