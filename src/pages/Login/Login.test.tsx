import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import Login from './'

test('should render Login', () => {
  const { container, getAllByRole } = TestRenderer(<Login />)

  const h1 = getAllByRole('heading')
  expect(container).toBeInTheDocument()
  expect(h1[0]).toHaveTextContent('Today I Learned')
  expect(h1[1]).toHaveTextContent('Login')
})
