import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter, Routes, Route } from 'react-router'

import Post from '.'

const meta: Meta<typeof Post> = {
  title: 'Pages/Post',
  component: Post,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/post/52']}>
        <Routes>
          <Route path="/post/:postId_querystring" element={<Story />} />
        </Routes>
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof Post>

export default meta

export const Default: StoryObj<typeof Post> = {}
