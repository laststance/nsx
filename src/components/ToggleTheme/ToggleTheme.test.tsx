import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import ToggleTheme from './index'

test('should render ToggleTheme', () => {
  const { container } = TestRenderer(<ToggleTheme />)
  expect(container).toBeInTheDocument()
})
