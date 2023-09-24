import type { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import ButtonGroup from './ButtonGroup'

const meta: ComponentMeta<typeof ButtonGroup> = {
  title: 'Components/PaginationButtonGroup',
  component: ButtonGroup,
}

export default meta

export const Default: ComponentStory<typeof ButtonGroup> = ({
  page,
  totalPage,
}) => <ButtonGroup page={page} totalPage={totalPage} />
