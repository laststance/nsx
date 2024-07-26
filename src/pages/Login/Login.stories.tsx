import type { Meta, StoryObj } from '@storybook/react'
import { HistoryRouter } from 'redux-first-history/rr6'

import { history } from '../../redux/store'

import Login from '.'

const meta = {
  title: 'Pages/Login',
  component: Login,
  tags: ['autodocs'],
} satisfies Meta<typeof Login>

export default meta

export const Default: StoryObj<typeof Login> = {
  render: () => (
    <HistoryRouter history={history}>
      <Login />
    </HistoryRouter>
  ),
}
