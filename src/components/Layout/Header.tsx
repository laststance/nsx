import React, { memo } from 'react'
import { Link } from 'react-router-dom'

import Github from '../icons/Github'
import { ThemeToggle } from '../ThemeToggle'

const Header = memo(
  () => (
    <header data-cy="header" className="w-full border-b border-gray-200">
      <div className="container mx-auto my-4 flex h-16 flex-col flex-wrap items-center gap-2 sm:flex-row sm:content-center">
        <Link to="/" className="col-auto" data-cy="blog-title-top-page-link">
          <h1 className="text-color-primary text-xl font-bold sm:text-2xl">
            Today I Learned
          </h1>
        </Link>
        <p className="text-color-secondary justify-self-start text-base sm:pt-2.5 sm:pl-1.5">
          What Today I Learned
          <span className="pl-1" role="img" aria-label="note emoji">
            📝
          </span>
        </p>
        <div className="flex space-x-2 sm:flex-grow sm:justify-end">
          <div className="flex-initial">
            <Link to="/about">
              <div className="text-color-secondary text-lg hover:text-gray-300 dark:hover:text-gray-500">
                about
              </div>
            </Link>
          </div>
          <div className="flex-initial pt-0.5">
            <ThemeToggle />
          </div>
          <div className="flex-initial">
            <a
              href="https://github.com/laststance/nsx"
              target="_blank"
              rel="noreferrer"
            >
              <Github />
            </a>
          </div>
        </div>
      </div>
    </header>
  ),
  () => true
)
Header.displayName = 'Header'

export default Header
