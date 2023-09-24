import type { ComponentStory } from '@storybook/react'
import React from 'react'
import { HistoryRouter } from 'redux-first-history/rr6'

import { history } from '../../redux/store'

import Dashboard from '.'

export default {
  title: 'Pages/Dashboard',
  component: Dashboard,
}

const Template: ComponentStory<typeof Dashboard> = () => (
  <HistoryRouter history={history}>
    <Dashboard />
  </HistoryRouter>
)

export const Default = Template.bind({})
Default.args = {}
