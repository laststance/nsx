import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import About from './'

test('should render About', () => {
  const { container } = TestRenderer(<About />)
  expect(container).toBeTruthy()
})
