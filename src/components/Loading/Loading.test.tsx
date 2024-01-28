import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import Loading from './index'

test('should render Loading', () => {
  const { container } = TestRenderer(<Loading />)
  expect(container).toBeInTheDocument()
})
