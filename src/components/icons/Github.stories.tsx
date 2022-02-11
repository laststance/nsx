import type { ComponentStory } from '@storybook/react'
import React from 'react'

import About from './Github'

export default {
  title: 'Components/Icons/Github',
  component: About,
}

const Template: ComponentStory<typeof About> = () => <About />

export const Default = Template.bind({})
Default.args = {}
