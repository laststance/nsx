import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import Spinner from './Spinner'

test('should render Sipinner', () => {
  const { container } = TestRenderer(<Spinner />)
  expect(container).toBeInTheDocument()
})
