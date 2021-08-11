import React from 'react'
import type { Meta, Story } from '@storybook/react'
import type { ButtonProps } from './Button'
import Button from './Button'

const meta: Meta = {
  title: 'components/elements/Button',
  component: Button,
  parameters: {
    controls: { expanded: true },
  },
}

export default meta

const Template: Story<ButtonProps> = (props) => <Button {...props} />

export const Primary = Template.bind({})
Primary.args = {
  children: 'Primary Button',
  variant: 'primary',
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
