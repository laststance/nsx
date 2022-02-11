import type { ComponentStory } from '@storybook/react'
import React from 'react'

import NotFound from './'

export default {
  title: 'Pages/NotFound',
  component: NotFound,
}

const Template: ComponentStory<typeof NotFound> = () => <NotFound />

export const Default = Template.bind({})
Default.args = {}
