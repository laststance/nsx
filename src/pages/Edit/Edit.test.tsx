import { waitFor } from '@testing-library/dom'
import React from 'react'
import { Routes, Route } from 'react-router-dom'

import { sleep } from '../../../lib/sleep'
import TestRenderer from '../../lib/TestRenderer'

import Edit from './'

test('should render Edit', async () => {
  const {
    container: { firstChild },
  } = TestRenderer(
    <Routes>
      <Route path="/edit/:postId" element={<Edit />} />
    </Routes>,
    {
      initialEntries: ['/edit/52'],
    }
  )
  await waitFor(async () => {
    // @TODO investigate why the loading screen was rendered even though tried taking so much sleep() time over 3000ms.
    await sleep(500)
    expect(firstChild).toBeTruthy()
  })
})
