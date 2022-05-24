import React from 'react'

import TestRenderer from '../lib/TestRenderer'

import Button from './Button'

test('should render Button', () => {
  const { container } = TestRenderer(<Button />)
  expect(container).toBeInTheDocument()
})

test('should show spiner when render with loading props', () => {
  const { getByTestId } = TestRenderer(<Button isLoading={true} />)
  expect(getByTestId('loading')).toBeInTheDocument()
})
