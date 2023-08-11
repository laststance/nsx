import type { ComponentStory } from '@storybook/react'
import React from 'react'
import { HistoryRouter } from 'redux-first-history/rr6'

import About from '.'

export default {
  component: About,
  title: 'Pages/About',
}

const Template: ComponentStory<typeof About> = () => (
  <HistoryRouter history={histo}>
    <About />
  </HistoryRouter>
)

export const Default = Template.bind({})
Default.args = {}
