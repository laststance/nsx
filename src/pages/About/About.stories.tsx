import type { Meta, StoryObj } from '@storybook/react-vite'
import { BrowserRouter } from 'react-router'

import About from '.'

const meta = {
  title: 'Pages/About',
  component: About,
  tags: ['autodocs'],
} satisfies Meta<typeof About>

export default meta
export const Default: StoryObj<typeof About> = {
  render: () => (
    <BrowserRouter>
      <About />
    </BrowserRouter>
  ),
}
