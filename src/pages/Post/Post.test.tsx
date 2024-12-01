import { waitFor, getByRole as $ } from '@testing-library/dom'
import React from 'react'
import { Routes, Route } from 'react-router'

import { sleep } from '../../../lib/sleep'
import TestRenderer from '../../lib/TestRenderer'

import Post from '.'

test('should render Post', async () => {
  const { container, getByRole } = TestRenderer(
    <Routes>
      <Route path="/post/:postId_querystring" element={<Post />} />
    </Routes>,
    {
      initialEntries: ['/post/2'],
    },
  )

  await waitFor(async () => {
    await sleep(100)
    expect(container).toBeInTheDocument()
    const main = getByRole('main')
    expect($(main, 'heading')).toHaveTextContent('superstruct')
  })
})
