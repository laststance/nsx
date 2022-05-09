import type { ComponentStory } from '@storybook/react'
import React from 'react'

import About from './Github'

export default {
  component: About,
  title: 'Components/Icons/Github',
}

const Template: ComponentStory<typeof About> = () => <About />

export const Default = Template.bind({})
Default.args = {}
