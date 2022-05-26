import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import Signup from './index'

test('should render Signup', () => {
  const { container } = TestRenderer(<Signup />)
  expect(container).toBeInTheDocument()
})

test('should show Signup page', () => {
  const { container, getByRole } = TestRenderer(<Signup />)

  expect(getByRole('heading')).toHaveTextContent('Signup')
  expect(container.querySelector('[data-cy="name-input"]')).toBeInTheDocument()
  expect(
    container.querySelector('[data-cy="password-input"]')
  ).toBeInTheDocument()
  expect(getByRole('button')).toHaveTextContent('Submit')
})
