import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router'

import Header from './Header'

const meta: Meta<typeof Header> = {
  title: 'Components/Layout/Header',
  component: Header,
  tags: ['autodocs'],
}

export default meta

export const Default: StoryObj<typeof Header> = {
  render: () => (
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  ),
}
