import React, { memo } from 'react'

const Footer = memo(
  () => (
    <footer>
      <div className="w-full flex flex-col items-center px-6 border-t mt-16 border-gray-200">
        <div className="py-6 text-center sm:w-2/3">
          <p className="text-sm text-gray-600">© 2021 by Ryota Murakami</p>
        </div>
      </div>
    </footer>
  ),
  () => true
)

export default Footer
