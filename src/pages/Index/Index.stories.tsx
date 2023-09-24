import type { ComponentStory } from '@storybook/react'
import React from 'react'
import { HistoryRouter } from 'redux-first-history/rr6'

import { history } from '../../redux/store'

import Index from '.'

export default {
  title: 'Pages',
  component: Index,
}

const Template: ComponentStory<typeof Index> = () => (
  <HistoryRouter history={history}>
    <Index />
  </HistoryRouter>
)

export const Default = Template.bind({})
Default.args = {}
