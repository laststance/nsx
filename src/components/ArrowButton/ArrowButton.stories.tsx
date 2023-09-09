import type { Meta, StoryObj } from '@storybook/react'

import ArrowButton from './ArrowButton'

const meta = {
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes

  component: ArrowButton,

  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },

  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],

  title: 'Components/ArrowButton',
} satisfies Meta<typeof ArrowButton>

export default meta
type Story = StoryObj<typeof meta>

export const Right: Story = {
  args: {
    direction: 'right',
  },
}

export const Left: Story = {
  args: {
    direction: 'left',
  },
}
