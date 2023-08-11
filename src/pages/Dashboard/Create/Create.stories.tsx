import type { ComponentStory } from '@storybook/react'
import React from 'react'
import { HistoryRouter } from 'redux-first-history/rr6'

import { history } from '../../../redux/store'

import Create from '.'

export default {
  component: Create,
  title: 'Pages/Create',
}

const Template: ComponentStory<typeof Create> = () => (
  <HistoryRouter history={history}>
    <Create />
  </HistoryRouter>
)

export const Default = Template.bind({})
Default.args = {}
