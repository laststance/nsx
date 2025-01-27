import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import React, { memo } from 'react'

const Search = memo(() => {
  return (
    <form className="flex w-full md:ml-0" action="#" method="GET">
      <label htmlFor="search-field" className="sr-only">
        Search
      </label>
      <div className="relative w-full text-gray-400 focus-within:text-gray-600">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
          <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
        </div>
        <input
          id="search-field"
          className="block h-full w-full border-transparent py-2 pr-3 pl-8 text-gray-900 placeholder-gray-500 focus:border-transparent focus:placeholder-gray-400 focus:ring-0 focus:outline-hidden sm:text-sm"
          placeholder="Search"
          type="search"
          name="search"
        />
      </div>
    </form>
  )
})
Search.displayName = 'Search'

export default Search
