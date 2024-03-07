import type { Meta, StoryObj } from '@storybook/react'

import Loading from './index'

const meta: Meta<typeof Loading> = {
  title: 'Components/Loading',
  component: Loading,
}

export default meta

export const Default: StoryObj<typeof Loading> = {
  render: () => <Loading />,
}
