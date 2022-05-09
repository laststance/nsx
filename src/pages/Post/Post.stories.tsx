import type { ComponentStory } from '@storybook/react'
import React from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'

import Post from './'

export default {
  component: Post,
  title: 'Pages/Post',
}

const Template: ComponentStory<typeof Post> = () => (
  <MemoryRouter initialEntries={['/post/52']}>
    <Routes>
      <Route path="/post/:postId" element={<Post />} />
    </Routes>
  </MemoryRouter>
)

export const Default = Template.bind({})
Default.args = {}
