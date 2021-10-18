import type { Meta, Story } from '@storybook/react'
import React from 'react'

import type { ButtonSpinerProps } from './ButtonSpiner'
import { ButtonSpiner } from './ButtonSpiner'

const meta: Meta = {
  title: 'Elements/ButtonSpinner',
  component: ButtonSpiner,
  parameters: {
    controls: { expanded: true },
  },
}

export default meta

const Template: Story<ButtonSpinerProps> = (props) => (
  <ButtonSpiner {...props} />
)

export const Default = Template.bind({})
Default.args = {}
