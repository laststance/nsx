import type { ComponentStory } from '@storybook/react'
import React from 'react'

import Footer from './Footer'

export default {
  title: 'Components/Layout/Footer',
  component: Footer,
}

const Template: ComponentStory<typeof Footer> = () => <Footer />

export const Default = Template.bind({})
Default.args = {}
