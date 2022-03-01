import type { ComponentStory } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import Dashboard from './'

export default {
  title: 'Pages/Dashboard',
  component: Dashboard,
}

const Template: ComponentStory<typeof Dashboard> = () => (
  <BrowserRouter>
    <Dashboard />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {}
