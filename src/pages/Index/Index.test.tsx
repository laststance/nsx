import { waitFor } from '@testing-library/dom'
import React from 'react'

import { sleep } from '../../../lib/sleep'
import TestRenderer from '../../lib/TestRenderer'

import Index from './'

test('should render Index', async () => {
  const {
    container: { firstChild },
  } = TestRenderer(<Index />)

  await waitFor(async () => {
    await sleep(500)
    expect(firstChild).toBeTruthy()
  })
})
