import type { ComponentStory } from '@storybook/react'
import React from 'react'

import ArrowLeft from './ArrowLeft'

export default {
  title: 'Components/Icons/ArrowLeft',
  component: ArrowLeft,
}

const Template: ComponentStory<typeof ArrowLeft> = () => <ArrowLeft />

export const Default = Template.bind({})
Default.args = {}
