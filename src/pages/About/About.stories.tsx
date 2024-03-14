import type { Meta, StoryObj } from '@storybook/react'
import { HistoryRouter } from 'redux-first-history/rr6'

import { history } from '../../redux/store'

import About from '.'

const meta = {
  title: 'Pages/About',
  component: About,
  tags: ['autodocs'],
} satisfies Meta<typeof About>

export default meta
export const Default: StoryObj<typeof About> = {
  render: () => (
    <HistoryRouter history={history}>
      <About />
    </HistoryRouter>
  ),
}
