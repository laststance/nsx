import type { ComponentStory } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import NotFound from './'

export default {
  component: NotFound,
  title: 'Pages/NotFound',
}

const Template: ComponentStory<typeof NotFound> = () => (
  <BrowserRouter>
    <NotFound />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {}
