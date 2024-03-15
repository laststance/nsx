import type { Meta, StoryObj } from '@storybook/react'
import { HistoryRouter } from 'redux-first-history/rr6'

import { history } from '../../redux/store'

import Signup from '.'

const meta: Meta<typeof Signup> = {
  title: 'Pages/Signup',
  component: Signup,
  decorators: [
    (Story) => (
      <HistoryRouter history={history}>
        <Story />
      </HistoryRouter>
    ),
  ],
} satisfies Meta<typeof Signup>

export default meta

export const Default: StoryObj<typeof Signup> = {}
