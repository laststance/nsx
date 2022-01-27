import { waitFor } from '@testing-library/dom'
import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import Index from './'

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

test('should render Index', async () => {
  const {
    container: { firstChild },
  } = TestRenderer(<Index />)

  await waitFor(
    async () => {
      await sleep(1000)
      expect(firstChild).toBeTruthy()
      expect(firstChild).toMatchSnapshot()
    },
    { timeout: 999999 }
  )
})
