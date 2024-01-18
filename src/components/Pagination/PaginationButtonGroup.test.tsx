import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import ButtonGroup from './ButtonGroup'

test('should render with props', () => {
  const { container } = TestRenderer(<ButtonGroup page={1} totalPage={10} />)
  expect(container).toBeInTheDocument()
})

test('should show correct page number and totalPage', () => {
  const { container } = TestRenderer(<ButtonGroup page={1} totalPage={10} />)
  const pageCountDiv = container.querySelector('[data-testid="page-count"]')
  expect(pageCountDiv).toHaveTextContent('1 / 10')
})

test('should disable button if unabile to page transition: case1', () => {
  const { container } = TestRenderer(<ButtonGroup page={1} totalPage={10} />)
  const prevBtn = container.querySelector('[data-testid="prev-page-btn"]')
  const nextBtn = container.querySelector('[data-testid="next-page-btn"]')
  expect(prevBtn).toBeDisabled()
  expect(nextBtn).toBeEnabled()
})

test('should disable button if unabile to page transition: case2', () => {
  const { container } = TestRenderer(<ButtonGroup page={10} totalPage={10} />)
  const prevBtn = container.querySelector('[data-testid="prev-page-btn"]')
  const nextBtn = container.querySelector('[data-testid="next-page-btn"]')
  expect(prevBtn).toBeEnabled()
  expect(nextBtn).toBeDisabled()
})

test('should enable button if page transition available', () => {
  const { container } = TestRenderer(<ButtonGroup page={5} totalPage={10} />)
  const prevBtn = container.querySelector('[data-testid="prev-page-btn"]')
  const nextBtn = container.querySelector('[data-testid="next-page-btn"]')
  expect(prevBtn).toBeEnabled()
  expect(nextBtn).toBeEnabled()
})
