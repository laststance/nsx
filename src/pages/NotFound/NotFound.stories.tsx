import type { ComponentStory } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import NotFound from './'

export default {
  title: 'Pages/NotFound',
  component: NotFound,
}

const Template: ComponentStory<typeof NotFound> = () => (
  <BrowserRouter>
    <NotFound />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {}
