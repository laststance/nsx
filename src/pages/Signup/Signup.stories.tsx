import type { ComponentStory } from '@storybook/react'
import React from 'react'
import { HistoryRouter } from 'redux-first-history/rr6'

import { history } from '../../redux/store'

import Signup from '.'

export default {
  title: 'Pages/Signup',
  component: Signup,
}

const Template: ComponentStory<typeof Signup> = () => (
  <HistoryRouter history={history}>
    <Signup />
  </HistoryRouter>
)

export const Default = Template.bind({})
Default.args = {}
