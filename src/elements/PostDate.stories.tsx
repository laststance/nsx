import type { ComponentStory } from '@storybook/react'
import React from 'react'

import PostDate from './PostDate'

export default {
  title: 'Elements/PostDate',
  component: PostDate,
}

const Template: ComponentStory<typeof PostDate> = (props) => (
  <PostDate {...props} />
)

export const Default = Template.bind({})
Default.args = { date: new Date().toDateString() }
