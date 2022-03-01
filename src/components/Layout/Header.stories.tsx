import type { ComponentStory } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import Header from './Header'

export default {
  title: 'Components/Layout/Header',
  component: Header,
}

const Template: ComponentStory<typeof Header> = () => (
  <BrowserRouter>
    <Header />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {}
