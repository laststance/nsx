import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import ArrowLeft from './ArrowLeft'

const meta = {
  title: 'Components/Icons/ArrowLeft',
  component: ArrowLeft,
  tags: ['autodocs'],
} as Meta<typeof ArrowLeft>

export default meta

export const Default: StoryObj<typeof meta> = {
  render: () => <ArrowLeft />,
}
