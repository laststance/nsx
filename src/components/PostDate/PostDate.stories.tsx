import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import PostDate from './PostDate'

const meta: Meta<typeof PostDate> = {
  title: 'Components/PostDate',
  component: PostDate,
}

export default meta

export const Default: StoryObj<typeof PostDate> = {
  render: (args) => <PostDate {...args} />,
  args: { date: 'Wed Jan 26 2022' },
}
