import { memo } from 'react'

const BannersCookiesBubble = memo(
  () => {
    return (
      <div className="z-60 fixed bottom-0 right-0 p-2 sm:p-4">
        <div className="flex max-w-xl flex-col items-center justify-between space-y-5 rounded-lg border border-transparent bg-gray-800 p-4 dark:border-gray-700 dark:bg-gray-900 dark:shadow-lg sm:flex-row sm:space-x-8 sm:space-y-0 sm:px-6 sm:py-5">
          <div>
            <h4 className="mb-1 font-semibold text-white">We use cookies</h4>
            <p className="text-sm font-medium leading-relaxed text-gray-400">
              This website uses cookies to personalise content, ads and to
              analyse our traffic.
            </p>
          </div>
          <div className="flex w-full items-center justify-start space-x-2 sm:w-auto sm:justify-end">
            <button
              type="button"
              className="inline-flex items-center justify-center space-x-2 rounded-lg border border-gray-700 bg-gray-700 px-3 py-2 text-sm font-semibold leading-5 text-white hover:border-gray-800 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring focus:ring-gray-500 focus:ring-opacity-25 active:border-gray-700 active:bg-gray-700"
            >
              <span>Manage</span>
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center space-x-2 rounded-lg border border-blue-700 bg-blue-700 px-3 py-2 text-sm font-semibold leading-5 text-white hover:border-blue-600 hover:bg-blue-600 hover:text-white focus:ring focus:ring-blue-400 focus:ring-opacity-90 active:border-blue-700 active:bg-blue-700"
            >
              <svg
                className="hi-solid hi-check inline-block h-5 w-5 opacity-50"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Accept</span>
            </button>
          </div>
        </div>
      </div>
    )
  },
  () => true,
)
BannersCookiesBubble.displayName = 'BannersCookiesBubble'

export default BannersCookiesBubble
