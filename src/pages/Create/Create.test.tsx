import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import Create from './'

test('should render Create', () => {
  const {
    container: { firstChild },
    getAllByRole,
  } = TestRenderer(<Create />)
  expect(firstChild).toBeTruthy()
  const [input, textarea] = getAllByRole('textbox')
  expect(input).toBeInTheDocument()
  expect(textarea).toBeInTheDocument()
  expect(getAllByRole('button')[1]).toHaveTextContent('Submit')
})
