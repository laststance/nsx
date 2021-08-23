import type { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import Button from './Button'

const meta: ComponentMeta<typeof Button> = {
  title: 'Elements/Button',
  component: Button,
}

export default meta

const Template: ComponentStory<typeof Button> = (props) => <Button {...props} />

export const Primary = Template.bind({})
Primary.args = {
  children: 'Primary Button',
  variant: 'primary',
}

export const Secondary = Template.bind({})
Secondary.args = {
  children: 'Secondary Button',
  variant: 'secondary',
}

export const Inverse = Template.bind({})
Inverse.args = {
  children: 'Inverse Button',
  variant: 'inverse',
}

export const Danger = Template.bind({})
Danger.args = {
  children: 'Danger Button',
  variant: 'danger',
}
