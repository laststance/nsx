import type { Meta, Story } from '@storybook/react'
import React from 'react'

import type { SpinnerProps } from './InnerSpiner'
import { InnterSpiner } from './InnerSpiner'

const meta: Meta = {
  title: 'Elements/InnerSpinner',
  component: InnterSpiner,
  parameters: {
    controls: { expanded: true },
  },
}

export default meta

const Template: Story<SpinnerProps> = (props) => <InnterSpiner {...props} />

export const Default = Template.bind({})
Default.args = {}
