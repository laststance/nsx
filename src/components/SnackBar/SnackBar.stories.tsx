import type { Meta, StoryObj } from '@storybook/react-vite'

import SnackBar from './SnackBar'

const meta: Meta<typeof SnackBar> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Components/SnackBar',
  component: SnackBar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof SnackBar>

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Success: Story = {
  args: { id: 1, color: 'green', message: 'Complete!' },
}

export const Error: Story = {
  args: { id: 2, color: 'red', message: 'Network Error' },
}
