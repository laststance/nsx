import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router'

import Create from '.'

const meta: Meta<typeof Create> = {
  title: 'Pages/Create',
  component: Create,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
}

export default meta

export const Default: StoryObj<typeof Create> = {}
