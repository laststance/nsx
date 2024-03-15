import type { Meta, StoryObj } from '@storybook/react'
import { HistoryRouter } from 'redux-first-history/rr6'

import { history } from '@/src/redux/store'

import Dashboard from '.'

const meta = {
  title: 'Pages/Dashboard',
  component: Dashboard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <HistoryRouter history={history}>
        <Story />
      </HistoryRouter>
    ),
  ],
} satisfies Meta<typeof Dashboard>

export default meta

export const Default: StoryObj<typeof meta> = {}
