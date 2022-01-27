import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import About from './'

test('should render About', () => {
  const {
    container: { firstChild },
  } = TestRenderer(<About />)
  expect(firstChild).toBeTruthy()
  expect(firstChild).toMatchSnapshot()
})
