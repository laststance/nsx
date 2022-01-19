import type { ComponentStory } from '@storybook/react'
import React from 'react'

import Header from './Header'

export default {
  title: 'Components/Header',
  component: Header,
}

const Template: ComponentStory<typeof Header> = () => <Header />

export const Default = Template.bind({})
Default.args = {}
