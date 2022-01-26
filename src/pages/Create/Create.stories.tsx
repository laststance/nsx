import type { ComponentStory } from '@storybook/react'
import React from 'react'

import Create from './'

export default {
  title: 'Pages/Create',
  component: Create,
}

const Template: ComponentStory<typeof Create> = () => <Create />

export const Default = Template.bind({})
Default.args = {}
