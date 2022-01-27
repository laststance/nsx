import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import Create from './'

test('should render Create', () => {
  const {
    container: { firstChild },
  } = TestRenderer(<Create />)
  expect(firstChild).toBeTruthy()
  expect(firstChild).toMatchSnapshot()
})
