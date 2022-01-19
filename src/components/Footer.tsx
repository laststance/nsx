import React, { memo } from 'react'

const Footer = memo(
  () => (
    <footer>
      <div className="flex flex-col items-center w-full px-6 border-t border-gray-200">
        <div className="sm:w-2/3 py-6 text-center">
          <p className="text-sm text-gray-600">© 2022 by Ryota Murakami</p>
        </div>
      </div>
    </footer>
  ),
  () => true
)
Footer.displayName = 'Footer'

export default Footer
