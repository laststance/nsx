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
      initialEntries: ['/edit/3'],
    }
  )
  await waitFor(async () => {
    await sleep(500)
    expect(firstChild).toBeTruthy()
    expect(firstChild).toMatchSnapshot()
  })
})
