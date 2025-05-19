import type { Meta, StoryObj } from '@storybook/react-vite'
import { BrowserRouter } from 'react-router'

import Signup from '.'

const meta: Meta<typeof Signup> = {
  title: 'Pages/Signup',
  component: Signup,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof Signup>

export default meta

export const Default: StoryObj<typeof Signup> = {}
