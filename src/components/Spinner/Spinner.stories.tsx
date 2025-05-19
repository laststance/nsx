import type { Meta, StoryObj } from '@storybook/react-vite'

import Spinner from './Spinner'

const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    controls: { expanded: true },
  },
  tags: ['autodocs'],
}

export default meta

export const Default: StoryObj<typeof meta> = { render: () => <Spinner /> }
