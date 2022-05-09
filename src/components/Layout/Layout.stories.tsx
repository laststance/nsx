import type { ComponentStory } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import Layout from './'

export default {
  component: Layout,
  title: 'Components/Layout',
}

const Template: ComponentStory<typeof Layout> = () => (
  <BrowserRouter>
    <Layout>
      <div
        style={{
          border: 'solid 1px #000',
          borderRadius: 8,
          fontSize: 24,
          fontWeight: 'bold',
          padding: 200,
          textAlign: 'center',
        }}
      >
        Layout Component
      </div>
    </Layout>
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {}
