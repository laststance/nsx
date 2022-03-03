import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import Login from './'

test('should render Login', () => {
  const {
    container: { firstChild },
  } = TestRenderer(<Login />)
  expect(firstChild).toBeTruthy()
  expect(firstChild).toMatchSnapshot()
})
