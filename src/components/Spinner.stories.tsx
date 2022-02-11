import type { Meta, Story } from '@storybook/react'
import React from 'react'

import type { SpinnerProps } from './Spinner'
import Spinner from './Spinner'

const meta: Meta = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    controls: { expanded: true },
  },
}

export default meta

const Template: Story<SpinnerProps> = (props) => <Spinner {...props} />

export const Default = Template.bind({})
Default.args = {}
