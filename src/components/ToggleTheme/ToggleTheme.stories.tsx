import type { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import ToggleTheme from './index'

const meta: ComponentMeta<typeof ToggleTheme> = {
  component: ToggleTheme,
  title: 'Components/ToggleTheme',
}

export default meta

export const Default: ComponentStory<typeof ToggleTheme> = () => (
  <div className="flex justify-end pr-20">
    <ToggleTheme />
  </div>
)
