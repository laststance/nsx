import type { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import ToggleTheme from '.'

const meta: ComponentMeta<typeof ToggleTheme> = {
  title: 'Components/ToggleTheme',
  component: ToggleTheme,
}

export default meta

export const Default: ComponentStory<typeof ToggleTheme> = () => (
  <div className="flex justify-end pr-20">
    <ToggleTheme />
  </div>
)
