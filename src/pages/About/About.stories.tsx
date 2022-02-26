import type { ComponentStory } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import About from './'

export default {
  title: 'Pages/About',
  component: About,
}

const Template: ComponentStory<typeof About> = () => (
  <BrowserRouter>
    <About />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {}
