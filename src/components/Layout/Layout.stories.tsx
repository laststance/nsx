import type { Meta, StoryObj } from '@storybook/react'
import { BrowserRouter } from 'react-router'

import Layout from '.'

const meta: Meta<typeof Layout> = {
  title: 'Components/Layout',
  component: Layout,
  tags: ['autodocs'],
}

export default meta

export const Default: StoryObj<typeof Layout> = {
  render: () => (
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
  ),
}
