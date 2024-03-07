import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import About from './Github'

const meta: Meta<typeof About> = {
  title: 'Components/Icons/Github',
  component: About,
}

export default meta

export const Default: StoryObj<typeof About> = {
  render: () => <About />,
}
