import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import ArrowButton from './ArrowButton'

test('should render ArrowButton', () => {
  const { container } = TestRenderer(<ArrowButton direction="left" />)
  expect(container).toBeInTheDocument()
})
