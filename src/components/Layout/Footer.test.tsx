import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import Footer from './Footer'

test('should render Footer', () => {
  const { container } = TestRenderer(<Footer />)
  expect(container).toHaveTextContent('by Ryota Murakami')
})
