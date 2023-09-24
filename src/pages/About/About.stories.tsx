import type { ComponentStory } from '@storybook/react'
import React from 'react'
import { HistoryRouter } from 'redux-first-history/rr6'

import { history } from '../../redux/store'

import About from '.'

export default {
  title: 'Pages/About',
  component: About,
}

const Template: ComponentStory<typeof About> = () => (
  <HistoryRouter history={history}>
    <About />
  </HistoryRouter>
)

export const Default = Template.bind({})
Default.args = {}
