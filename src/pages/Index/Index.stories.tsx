import type { Meta, StoryObj } from '@storybook/react-vite'
import { BrowserRouter } from 'react-router'

import Index from '.'

const meta: Meta<typeof Index> = {
  title: 'Pages/Index',
  component: Index,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof Index>

export default meta

export const Default: StoryObj<typeof Index> = {}
