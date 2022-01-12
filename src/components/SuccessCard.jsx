import React from 'react'
import parse from 'style-to-object'

import icon from './icon.svg'

const SuccessCard = () => (
  <div
    className="bg-none flex px-4 py-1 mb-2 font-sans text-sm font-normal leading-normal tracking-normal text-green-200 bg-gray-800 shadow-none"
    role="alert"
    style={parse(
      'transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms; border-radius: 10px;'
    )}
  >
    <div
      className="flex px-0 py-2 mr-3 text-xl leading-8 text-green-600"
      style={parse('opacity: 0.9;')}
    >
      <img src={icon} alt="icon" />
    </div>
    <div className="px-0 py-2 leading-5">
      <div className="mx-0 mb-1 -mt-px text-sm font-bold leading-normal">
        Thanks! Check your email.
      </div>
      You should get a <strong className="font-bold">confirmation email</strong>{' '}
      soon. Open it up and confirm your email address so that we can keep you up
      to date.
    </div>
  </div>
)

export default SuccessCard
