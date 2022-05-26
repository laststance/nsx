import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import Signup from './index'

test('should render Signup Component', () => {
  const { container } = TestRenderer(<Signup />)
  expect(container).toBeInTheDocument()
})

test('should show Signup Form', () => {
  const { container, getByRole } = TestRenderer(<Signup />)

  expect(getByRole('heading')).toHaveTextContent('Signup')
  expect(
    container.querySelector('[data-cy="signup-name-input"]')
  ).toBeInTheDocument()
  expect(
    container.querySelector('[data-cy="signup-password-input"]')
  ).toBeInTheDocument()
  expect(getByRole('button')).toHaveTextContent('Submit')
})
