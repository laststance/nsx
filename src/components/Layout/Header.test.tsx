import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import TestRenderer from '../../lib/TestRenderer'

import Header from './Header'

test('should render Header', () => {
  const { container } = TestRenderer(<Header />)
  expect(container).toHaveTextContent('Today I Learned')
})
