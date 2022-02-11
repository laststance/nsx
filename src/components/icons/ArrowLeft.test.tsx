import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import ArrowLeft from './ArrowLeft'

test('should render ArrowLeft', () => {
  const {
    container: { firstChild },
  } = TestRenderer(<ArrowLeft />)
  expect(firstChild).toBeTruthy()
  expect(firstChild).toMatchSnapshot()
})
