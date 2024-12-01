import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router-dom'

import Login from '.'

const meta = {
  title: 'Pages/Login',
  component: Login,
  tags: ['autodocs'],
} satisfies Meta<typeof Login>

export default meta

export const Default: StoryObj<typeof Login> = {
  render: () => (
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  ),
}
