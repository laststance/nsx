import type { Meta, StoryObj } from '@storybook/react'

import type ArrowButton from '../ArrowButton'

import Search from './Search'

const meta: Meta<typeof ArrowButton> = {
  title: 'Components/Search',
  component: Search,
  tags: ['autodocs'],
}

export default meta

export const Default: StoryObj<typeof meta> = {
  render: () => (
    <div style={{ width: '600px' }}>
      <Search />
    </div>
  ),
}
