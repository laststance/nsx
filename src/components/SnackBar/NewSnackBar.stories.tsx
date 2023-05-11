import type { Meta, StoryObj } from '@storybook/react'

import NewSnackBar from './NewSnackBar'

const meta: Meta<typeof NewSnackBar> = {
  component: NewSnackBar,
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'NewSnackBar',
}

export default meta
type Story = StoryObj<typeof NewSnackBar>

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => <NewSnackBar />,
}
