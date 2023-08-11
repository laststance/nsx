import type { ComponentStory } from '@storybook/react'
import React from 'react'
import { HistoryRouter } from 'redux-first-history/rr6'

import { history } from '../../redux/store'

import Layout from '.'

export default {
  component: Layout,
  title: 'Components/Layout',
}

const Template: ComponentStory<typeof Layout> = () => (
  <HistoryRouter history={history}>
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
  </HistoryRouter>
)

export const Default = Template.bind({})
Default.args = {}
