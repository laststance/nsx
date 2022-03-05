import { expect } from '@storybook/jest'
import type { ComponentMeta, ComponentStory } from '@storybook/react'
import { within } from '@storybook/testing-library'
import React from 'react'

import ArrowButton from './ArrowButton'

const meta: ComponentMeta<typeof ArrowButton> = {
  title: 'Components/ArrowButton',
  component: ArrowButton,
}

export default meta

const Template: ComponentStory<typeof ArrowButton> = (props) => (
  <ArrowButton {...props} />
)

export const Right = Template.bind({})
Right.args = {
  direction: 'right',
}

export const Left = Template.bind({})
Left.args = {
  direction: 'left',
}

export const RightTesting = {
  args: { direction: 'right' },
  // @ts-ignore
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByTestId('arrow-right')).toBeInTheDocument()
  },
}
