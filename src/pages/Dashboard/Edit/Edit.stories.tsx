import type { Meta, StoryObj } from '@storybook/react'
import { MemoryRouter, Routes, Route } from 'react-router'

import Edit from '.'

const meta = {
  title: 'Pages/Edit',
  component: Edit,
  tags: ['autodocs'],
} satisfies Meta<typeof Edit>

export default meta

export const Default: StoryObj<typeof meta> = {
  render: () => (
    <MemoryRouter initialEntries={['/edit/52']}>
      <Routes>
        <Route path="/edit/:postId" element={<Edit />} />
      </Routes>
    </MemoryRouter>
  ),
}
