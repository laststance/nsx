import type { ComponentStory } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import Signup from './index'

export default {
  component: Signup,
  title: 'Pages/Signup',
}

const Template: ComponentStory<typeof Signup> = () => (
  <BrowserRouter>
    <Signup />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {}
