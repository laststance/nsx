import type { Meta, StoryObj } from '@storybook/react'
import { HistoryRouter } from 'redux-first-history/rr6'

import { history } from '../../redux/store'

import Index from '.'

const meta: Meta<typeof Index> = {
  title: 'Pages',
  component: Index,
  decorators: [
    (Story) => (
      <HistoryRouter history={history}>
        <Story />
      </HistoryRouter>
    ),
  ],
} satisfies Meta<typeof Index>

export default meta

export const Default: StoryObj<typeof Index> = {}
