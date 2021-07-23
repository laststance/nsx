import React from 'react'

const Footer: React.FC = () => (
  <div className="container px-6 mx-auto mt-16">
    <div className="flex flex-col items-center border-t border-gray-200">
      <div className="py-6 text-center sm:w-2/3">
        <p className="text-sm text-gray-600">© 2021 by Ryota Murakami</p>
      </div>
    </div>
  </div>
)

export default React.memo(Footer, () => true)
