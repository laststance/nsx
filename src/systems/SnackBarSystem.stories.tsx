import type { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'

import { store } from '../redux/store'

import SnackbarSystemProvider from './SnackBarSystem'

const meta: ComponentMeta<typeof SnackbarSystemProvider> = {
  title: 'System/SnackbarSystem',
  component: SnackbarSystemProvider,
}

export default meta

// @ts-ignore
window.reduxSrore = store

const Template: ComponentStory<typeof SnackbarSystemProvider> = (props) => (
  <ReduxProvider store={store}>
    <SnackbarSystemProvider {...props} />
  </ReduxProvider>
)

export const Primary = Template.bind({})
Primary.args = {}
