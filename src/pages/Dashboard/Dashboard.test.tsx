import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import Dashboard from './'

test('should render Dashboard', () => {
  const {
    container: { firstChild },
  } = TestRenderer(<Dashboard />)
  expect(firstChild).toBeTruthy()
  expect(firstChild).toMatchSnapshot()
})
