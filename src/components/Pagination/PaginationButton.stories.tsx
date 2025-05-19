import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import ButtonGroup from './ButtonGroup'

const meta: Meta<typeof ButtonGroup> = {
  title: 'Components/PaginationButtonGroup',
  component: ButtonGroup,
}

export default meta

export const Default: StoryObj<typeof ButtonGroup> = {
  render: ({ page, totalPage }) => (
    <ButtonGroup page={page} totalPage={totalPage} />
  ),
}
