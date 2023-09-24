import type { ComponentStory } from '@storybook/react'
import React from 'react'
import { HistoryRouter } from 'redux-first-history/rr6'

import { history } from '../../redux/store'

import Login from '.'

export default {
  title: 'Pages/Login',
  component: Login,
}

const Template: ComponentStory<typeof Login> = () => (
  <HistoryRouter history={history}>
    <Login />
  </HistoryRouter>
)

export const Default = Template.bind({})
Default.args = {}
