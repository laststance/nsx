import type { Meta, StoryObj } from '@storybook/react-vite'

import Footer from './Footer'

const meta: Meta<typeof Footer> = {
  title: 'Components/Layout/Footer',
  component: Footer,
  tags: ['autodocs'],
}

export default meta

export const Default: StoryObj<typeof meta> = {
  render: () => <Footer />,
}
