import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import PostDate from './PostDate'

test('should show human readable date form', () => {
  const { getByText } = TestRenderer(
    <PostDate date="2021-07-03T13:09:16.000Z" />
  )
  expect(getByText('07/03/21')).toBeInTheDocument()
})
