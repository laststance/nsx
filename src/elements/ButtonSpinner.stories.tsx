import type { Meta, Story } from '@storybook/react'
import React from 'react'

import type { ButtonSpinerProps } from './ButtonSpinner'
import ButtonSpinner from './ButtonSpinner'

const meta: Meta = {
  title: 'Elements/ButtonSpinner',
  component: ButtonSpinner,
  parameters: {
    controls: { expanded: true },
  },
}

export default meta

const Template: Story<ButtonSpinerProps> = (props) => (
  <ButtonSpinner {...props} />
)

export const Default = Template.bind({})
Default.args = {}
