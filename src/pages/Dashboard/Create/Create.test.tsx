import React from 'react'

import TestRenderer from '../../../lib/TestRenderer'

import Create from './index'

test('should render Create Page', () => {
  const { container, getAllByRole } = TestRenderer(<Create />)
  expect(container).toBeInTheDocument()
  const [input, textarea] = getAllByRole('textbox')
  expect(input).toBeInTheDocument()
  expect(textarea).toBeInTheDocument()
  expect(getAllByRole('button')[1]).toHaveTextContent('Submit')
})
