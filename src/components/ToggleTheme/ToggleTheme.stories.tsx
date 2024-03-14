import type { Meta, StoryObj } from '@storybook/react'

import ToggleTheme from '.'

const meta: Meta<typeof ToggleTheme> = {
  title: 'Components/ToggleTheme',
  component: ToggleTheme,
  argTypes: {
    theme: {
      control: {
        type: 'select',
        options: ['light', 'dark'],
      },
    },
  },
  tags: ['autodocs'],
}

export default meta

export const Default: StoryObj<typeof ToggleTheme> = {
  render: () => (
    <div className="flex justify-end pr-20">
      <ToggleTheme />
    </div>
  ),
}
