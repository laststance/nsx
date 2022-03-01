import type { ComponentStory } from '@storybook/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import Layout from './'

export default {
  title: 'Components/Layout',
  component: Layout,
}

const Template: ComponentStory<typeof Layout> = () => (
  <BrowserRouter>
    <Layout>
      <div
        style={{
          padding: 200,
          fontSize: 24,
          fontWeight: 'bold',
          border: 'solid 1px #000',
          borderRadius: 8,
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
