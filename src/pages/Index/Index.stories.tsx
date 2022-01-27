import type { ComponentStory } from '@storybook/react'
import React from 'react'

import Index from './'

export default {
  title: 'Pages/Index',
  component: Index,
}

const Template: ComponentStory<typeof Index> = () => <Index />

export const Default = Template.bind({})
Default.args = {}
