import { waitFor } from '@testing-library/dom'
import React from 'react'

import { sleep } from '../../../lib/sleep'
import TestRenderer from '../../lib/TestRenderer'

import Index from './'

test('should render IndexPage with latest 15 posts', async () => {
  const { container, getAllByRole } = TestRenderer(<Index />)

  await waitFor(async () => {
    await sleep(500) // wait for loading
    expect(container).toBeInTheDocument()
    const posts = getAllByRole('listitem')
    expect(posts.length).toEqual(15)
    expect(posts[0]).toHaveTextContent('01/14/22')
    expect(posts[0]).toHaveTextContent('What is matter my $500 for')
  })
})
