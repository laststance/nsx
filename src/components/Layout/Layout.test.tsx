import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import Layout from './'

test('should render Layout', () => {
  const {
    container: { firstChild },
  } = TestRenderer(<Layout />)
  expect(firstChild).toBeTruthy()
  expect(firstChild).toMatchSnapshot()
})
