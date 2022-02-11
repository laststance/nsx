import type { ComponentStory } from '@storybook/react'
import React from 'react'

import ArrowRight from './ArrowRight'

export default {
  title: 'Components/Icons/ArrowRight',
  component: ArrowRight,
}

const Template: ComponentStory<typeof ArrowRight> = () => <ArrowRight />

export const Default = Template.bind({})
Default.args = {}
