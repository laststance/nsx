import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router'

import NotFound from '.'

const meta: Meta<typeof NotFound> = {
  title: 'Pages/NotFound',
  component: NotFound,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof NotFound>

export default meta

export const Default: StoryObj<typeof NotFound> = {}
