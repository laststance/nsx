import type { ComponentStory } from '@storybook/react'
import React from 'react'
import { HistoryRouter } from 'redux-first-history/rr6'

import { history } from '../../redux/store'

import NotFound from '.'

export default {
  title: 'Pages/NotFound',
  component: NotFound,
}

const Template: ComponentStory<typeof NotFound> = () => (
  <HistoryRouter history={history}>
    <NotFound />
  </HistoryRouter>
)

export const Default = Template.bind({})
Default.args = {}
