import { waitFor } from '@testing-library/dom'
import React, { useState, useLayoutEffect } from 'react'

import TestRenderer from '../../lib/TestRenderer'

import Button from './Button'

test('should render Button', () => {
  const { container } = TestRenderer(<Button />)
  expect(container).toBeInTheDocument()
})

test('should show spiner when render with loading props', () => {
  const { getByTestId } = TestRenderer(<Button isLoading={true} />)
  expect(getByTestId('loading')).toBeInTheDocument()
})

test('should not show spiner when render with loading props', () => {
  const { getByTestId } = TestRenderer(<Button isLoading={false} />)
  expect(() => getByTestId('loading')).toThrowError()
})

test('should default type is button', () => {
  const { getByRole } = TestRenderer(<Button />)
  const button = getByRole('button') as HTMLButtonElement
  expect(button.type).toBe('button')
})

test('should apply type props', () => {
  const { getByRole } = TestRenderer(<Button type="submit" />)
  const button = getByRole('button') as HTMLButtonElement
  expect(button.type).toBe('submit')
})

test('should apply primary color by default', () => {
  const { getByRole } = TestRenderer(<Button />)
  const button = getByRole('button')
  expect(button.className).toContain(
    'bg-green-500 hover:bg-green-600 text-white'
  )
})

test('should apply primary variant', () => {
  const { getByRole } = TestRenderer(<Button variant="primary" />)
  const button = getByRole('button')
  expect(button.className).toContain(
    'bg-green-500 hover:bg-green-600 text-white'
  )
})

test('should apply secondary variant', () => {
  const { getByRole } = TestRenderer(<Button variant="secondary" />)
  const button = getByRole('button')
  expect(button.className).toContain('bg-blue-500 hover:bg-blue-600 text-white')
})

test('shold apply inverse variant', () => {
  const { getByRole } = TestRenderer(<Button variant="inverse" />)
  const button = getByRole('button')
  expect(button.className).toContain(
    'bg-white text-green-400 border border-green-400 hover:bg-green-500 hover:text-white'
  )
})

test('should apply denger variant', () => {
  const { getByRole } = TestRenderer(<Button variant="danger" />)
  const button = getByRole('button')
  expect(button.className).toContain('bg-red-500 text-white hover:bg-red-600')
})

test('should apply md size by default', () => {
  const { getByRole } = TestRenderer(<Button />)
  const button = getByRole('button')
  expect(button.className).toContain('py-2 px-6 text-md')
})

test('should apply md size', () => {
  const { getByRole } = TestRenderer(<Button size="md" />)
  const button = getByRole('button')
  expect(button.className).toContain('py-2 px-6 text-md')
})

test('should aply sm size', () => {
  const { getByRole } = TestRenderer(<Button size="sm" />)
  const button = getByRole('button')
  expect(button.className).toContain('py-2 px-4 text-sm')
})

test('should apply lg size', () => {
  const { getByRole } = TestRenderer(<Button size="lg" />)
  const button = getByRole('button')
  expect(button.className).toContain('py-3 px-8 text-lg')
})

test('should apply child text', () => {
  const { getByRole } = TestRenderer(
    <Button size="lg" variant="secondary">
      Fire
    </Button>
  )
  const button = getByRole('button')
  expect(button).toHaveTextContent('Fire')
})

const Loader = () => {
  const [state, setState] = useState(true)
  useLayoutEffect(() => {
    setTimeout(() => setState(() => false), 1000)
  }, [])

  return <Button isLoading={state}>Shade</Button>
}

test('async', async () => {
  const { getByTestId } = TestRenderer(<Loader />)
  expect(getByTestId('loading')).toBeInTheDocument()
  waitFor(() => {
    expect(() => getByTestId('loading')).toThrowError()
  })
})
