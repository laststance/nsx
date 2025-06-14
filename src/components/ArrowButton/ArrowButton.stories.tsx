import type { Meta, StoryObj } from '@storybook/react-vite'

import ArrowButton from './ArrowButton'

const meta: Meta<typeof ArrowButton> = {
  title: 'Components/ArrowButton',
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes

  component: ArrowButton,

  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'centered',
  },
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

export const Disabled: StoryObj<typeof meta> = {
  args: {
    direction: 'right',
    disabled: true,
  },
}

export const WithCustomProps: StoryObj<typeof meta> = {
  args: {
    direction: 'left',
    'aria-label': 'Previous page',
    'data-testid': 'nav-previous',
  },
}
