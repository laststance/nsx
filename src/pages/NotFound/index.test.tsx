import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import NotFound from './index'

test('show 404 page', () => {
  const { container } = TestRenderer(<NotFound />)
  expect(container).toHaveTextContent('404: Page Not Found')
})
