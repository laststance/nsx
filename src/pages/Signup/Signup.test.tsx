import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import Signup from './'

test('should render Signup', () => {
  const { container } = TestRenderer(<Signup />)
  expect(container).toBeInTheDocument()
})
