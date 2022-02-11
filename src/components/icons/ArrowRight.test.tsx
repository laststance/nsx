import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import ArrowRight from './ArrowRight'

test('should render ArrowRight', () => {
  const {
    container: { firstChild },
  } = TestRenderer(<ArrowRight />)
  expect(firstChild).toBeTruthy()
  expect(firstChild).toMatchSnapshot()
})
