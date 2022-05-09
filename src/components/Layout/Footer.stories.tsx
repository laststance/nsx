import type { ComponentStory } from '@storybook/react'
import React from 'react'

import Footer from './Footer'

export default {
  component: Footer,
  title: 'Components/Layout/Footer',
}

const Template: ComponentStory<typeof Footer> = () => <Footer />

export const Default = Template.bind({})
Default.args = {}
