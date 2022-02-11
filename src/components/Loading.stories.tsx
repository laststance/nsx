import type { Story } from '@storybook/react'
import React from 'react'

import Loading from './Loading'

export default {
  title: 'Components/Loading',
  component: Loading,
}

const Template: Story = (props) => <Loading {...props} />

export const Default = Template.bind({})
Default.args = {}
