import type { Meta, StoryObj } from '@storybook/react'
import { HistoryRouter } from 'redux-first-history/rr6'

import { history } from '@/src/redux/store'

import Create from '.'

const meta: Meta<typeof Create> = {
  title: 'Pages/Create',
  component: Create,
  decorators: [
    (Story) => (
      <HistoryRouter history={history}>
        <Story />
      </HistoryRouter>
    ),
  ],
}

export default meta

export const Default: StoryObj<typeof Create> = {}
