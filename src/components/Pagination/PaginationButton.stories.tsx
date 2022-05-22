import type { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import ButtonGroup from './ButtonGroup'

const meta: ComponentMeta<typeof ButtonGroup> = {
  component: ButtonGroup,
  title: 'Components/PaginationButtonGroup',
}

export default meta

export const Default: ComponentStory<typeof ButtonGroup> = ({
  page,
  totalPage,
}) => <ButtonGroup page={page} totalPage={totalPage} />
