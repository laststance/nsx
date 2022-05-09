import type { ComponentStory } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import Index from './'

export default {
  component: Index,
  title: 'Pages/Index',
}

const Template: ComponentStory<typeof Index> = () => (
  <BrowserRouter>
    <Index />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {}
