import { waitFor, getByRole } from '@testing-library/dom'
import React from 'react'

import { sleep } from '../../../lib/sleep'
import TestRenderer from '../../lib/TestRenderer'

import Dashboard from './'

test('should render Dashboard', async () => {
  const { container } = TestRenderer(<Dashboard />)

  await waitFor(async () => {
    await sleep(500) // wait for loading
    expect(container).toBeInTheDocument()
    const main = getByRole(container, 'main')
    expect(getByRole(main, 'heading')).toHaveTextContent('Dashboard')
  })
})
