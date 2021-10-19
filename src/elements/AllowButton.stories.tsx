import type { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import ArrowButton from './ArrowButton'

const meta: ComponentMeta<typeof ArrowButton> = {
  title: 'Elements/ArrowButton',
  component: ArrowButton,
}

export default meta

export const Template: ComponentStory<typeof ArrowButton> = (props) => (
  <ArrowButton {...props} />
)
