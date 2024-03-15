import type { Meta, StoryObj } from '@storybook/react'
import { HistoryRouter } from 'redux-first-history/rr6'

import { history } from '../../redux/store'

import NotFound from '.'

const meta: Meta<typeof NotFound> = {
  title: 'Pages/NotFound',
  component: NotFound,
  decorators: [
    (Story) => (
      <HistoryRouter history={history}>
        <Story />
      </HistoryRouter>
    ),
  ],
} satisfies Meta<typeof NotFound>

export default meta

export const Default: StoryObj<typeof NotFound> = {}
