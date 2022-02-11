import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import Github from './Github'

test('should render Github', () => {
  const {
    container: { firstChild },
  } = TestRenderer(<Github />)
  expect(firstChild).toBeTruthy()
  expect(firstChild).toMatchSnapshot()
})
