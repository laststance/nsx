import type { ComponentStory } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import Dashboard from './'

export default {
  component: Dashboard,
  title: 'Pages/Dashboard',
}

const Template: ComponentStory<typeof Dashboard> = () => (
  <BrowserRouter>
    <Dashboard />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {}
