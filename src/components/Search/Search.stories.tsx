import type { Story } from '@storybook/react'
import React from 'react'

import Search from './Search'

export default {
  component: Search,
  title: 'Components/Search',
}

const Template: Story = (props) => (
  <div style={{ width: '600px' }}>
    <Search {...props} />
  </div>
)

export const Default = Template.bind({})
Default.args = {}
