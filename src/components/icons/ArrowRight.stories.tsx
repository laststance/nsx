import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import ArrowRight from './ArrowRight'

const meta = {
  title: 'Components/Icons/ArrowRight',
  component: ArrowRight,
  tags: ['autodocs'],
} as Meta<typeof ArrowRight>

export default meta

export const Default: StoryObj<typeof meta> = {
  render: () => <ArrowRight />,
}
