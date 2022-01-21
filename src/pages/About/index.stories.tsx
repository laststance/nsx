import type { ComponentStory } from '@storybook/react'
import React from 'react'

import About from './'

export default {
  title: 'Pages/About',
  component: About,
}

const Template: ComponentStory<typeof About> = () => <About />

export const Default = Template.bind({})
Default.args = {}
