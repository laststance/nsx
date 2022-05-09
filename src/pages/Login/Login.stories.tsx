import type { ComponentStory } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import Login from './'

export default {
  component: Login,
  title: 'Pages/Login',
}

const Template: ComponentStory<typeof Login> = () => (
  <BrowserRouter>
    <Login />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {}
