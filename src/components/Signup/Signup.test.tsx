import { getByRole } from '@testing-library/dom'
import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import Signup from './index'

test('should render Signup', () => {
  const { container } = TestRenderer(<Signup />)
  expect(container).toBeInTheDocument()
})

test('should show Signup page', () => {
  const { container } = TestRenderer(<Signup />)
  const main = getByRole(container, 'main')
  expect(getByRole(main, 'heading')).toHaveTextContent('Signup')
  expect(main.querySelector('[data-cy="name-input"]')).toBeInTheDocument()
  expect(main.querySelector('[data-cy="password-input"]')).toBeInTheDocument()
  expect(getByRole(main, 'button')).toHaveTextContent('Submit')
})
