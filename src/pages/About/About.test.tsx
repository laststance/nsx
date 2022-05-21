import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import About from './'

test('should render About', () => {
  const {
    container: { firstChild },
    getAllByRole,
  } = TestRenderer(<About />)
  expect(firstChild).toBeTruthy()
  expect(getAllByRole('heading')[1]).toHaveTextContent('About')
})
