import type { Meta, StoryObj } from '@storybook/react'

import Button from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
}

export default meta

export const Primary: StoryObj<typeof meta> = {
  args: {
    children: 'Primary Color',
    variant: 'primary',
  },
}

export const Secondary: StoryObj<typeof meta> = {
  args: {
    children: 'Secondary Color',
    variant: 'secondary',
  },
}
Secondary.args = {
  children: 'Secondary Color',
  variant: 'secondary',
}

export const Inverse: StoryObj<typeof meta> = {
  args: {
    children: 'Inverse Color',
    variant: 'inverse',
  },
}

export const Danger: StoryObj<typeof meta> = {
  args: {
    children: 'Danger Color',
    variant: 'danger',
  },
}
