import type { Meta, StoryObj } from '@storybook/react'

import ArrowButton from './ArrowButton'

const meta: Meta<typeof ArrowButton> = {
  title: 'Components/ArrowButton',
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes

  component: ArrowButton,

  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },

  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
}

export default meta

export const Right: StoryObj<typeof meta> = {
  args: {
    direction: 'right',
  },
}

export const Left: StoryObj<typeof meta> = {
  args: {
    direction: 'left',
  },
}
