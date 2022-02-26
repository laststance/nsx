import React from 'react'
import { Routes, Route } from 'react-router-dom'

import TestRenderer from '../../lib/TestRenderer'

import Edit from './'

test('should render Edit', () => {
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
  expect(firstChild).toBeTruthy()
  expect(firstChild).toMatchSnapshot()
})
