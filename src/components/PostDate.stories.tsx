import type { ComponentStory } from '@storybook/react'
import React from 'react'

import PostDate from './PostDate'

export default {
  component: PostDate,
  title: 'Components/PostDate',
}

const Template: ComponentStory<typeof PostDate> = (props) => (
  <PostDate {...props} />
)

export const Default = Template.bind({})
Default.args = { date: 'Wed Jan 26 2022' }
