import React, { memo } from 'react'

const Footer = memo(
  () => (
    <footer className="w-full">
      <div className="flex w-full flex-col items-center border-t border-gray-200 px-6">
        <div className="py-6 text-center sm:w-2/3">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} by Ryota Murakami
          </p>
        </div>
      </div>
    </footer>
  ),
  () => true,
)
Footer.displayName = 'Footer'

export default Footer
