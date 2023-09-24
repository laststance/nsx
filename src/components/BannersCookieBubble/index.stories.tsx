import type { Meta, StoryObj } from '@storybook/react'

import BannarsCookieBubble from '.'

const meta: Meta<typeof BannarsCookieBubble> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'components/BannarsCookieBubble',
  component: BannarsCookieBubble,
}

export default meta
type Story = StoryObj<typeof BannarsCookieBubble>

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => <BannarsCookieBubble />,
}
