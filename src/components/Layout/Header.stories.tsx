import type { ComponentStory } from '@storybook/react'
import React from 'react'
import { HistoryRouter } from 'redux-first-history/rr6'

import { history } from '../../redux/store'

import Header from './Header'

export default {
  component: Header,
  title: 'Components/Layout/Header',
}

const Template: ComponentStory<typeof Header> = () => (
  <HistoryRouter history={history}>
    <Header />
  </HistoryRouter>
)

export const Default = Template.bind({})
Default.args = {}
