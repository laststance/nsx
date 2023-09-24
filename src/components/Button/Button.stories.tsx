import type { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import Button from './Button'

const meta: ComponentMeta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
}

export default meta

const Template: ComponentStory<typeof Button> = (props) => <Button {...props} />

export const Primary = Template.bind({})
Primary.args = {
  children: 'Primary Color',
  variant: 'primary',
}

export const Secondary = Template.bind({})
Secondary.args = {
  children: 'Secondary Color',
  variant: 'secondary',
}

export const Inverse = Template.bind({})
Inverse.args = {
  children: 'Inverse Color',
  variant: 'inverse',
}

export const Danger = Template.bind({})
Danger.args = {
  children: 'Danger Color',
  variant: 'danger',
}
