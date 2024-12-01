import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router'

import Dashboard from '.'

const meta = {
  title: 'Pages/Dashboard',
  component: Dashboard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof Dashboard>

export default meta

export const Default: StoryObj<typeof meta> = {}
