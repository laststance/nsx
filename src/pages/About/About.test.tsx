import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import About from './'

test('should render About Page', () => {
  const { container, getAllByRole } = TestRenderer(<About />)
  expect(container).toBeInTheDocument()
  expect(getAllByRole('heading')[1]).toHaveTextContent('About')
})
