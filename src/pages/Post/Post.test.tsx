import { waitFor } from '@testing-library/dom'
import React from 'react'
import { Routes, Route } from 'react-router-dom'

import { sleep } from '../../../lib/sleep'
import TestRenderer from '../../lib/TestRenderer'

import Post from './'

test('should render Post', async () => {
  const { container, getByRole } = TestRenderer(
    <Routes>
      <Route path="/post/:postId" element={<Post />} />
    </Routes>,
    {
      initialEntries: ['/post/2'],
    }
  )

  await waitFor(async () => {
    await sleep(300)
    expect(container).toBeInTheDocument()
    const main = getByRole('main')
    expect(main).toMatchInlineSnapshot(`
<main
  class="container mx-auto flex-grow px-4 py-4"
>
  <h1
    class="text-color-primary pt-4 pb-6 text-2xl font-semibold"
  >
    superstruct
  </h1>
  is masterpiece of validation library ever.

\`\`\`js
import { is, define, object, string } from 'superstruct'
import isUuid from 'is-uuid'
import isEmail from 'is-email'

const Email = define('Email', isEmail)
const Uuid = define('Uuid', isUuid.v4)

const User = object({
  id: Uuid,
  email: Email,
  name: string(),
})

const data = {
  id: 'c8d63140-a1f7-45e0-bfc6-df72973fea86',
  email: 'jane@example.com',
  name: 'Jane',
}

if (is(data, User)) {
  // Your data is guaranteed to be valid in this block.
}

\`\`\`

- [ianstormtaylor/superstruct: A simple and composable way to validate data in JavaScript (and TypeScript).](https://github.com/ianstormtaylor/superstruct)
</main>
`)
  })
})
