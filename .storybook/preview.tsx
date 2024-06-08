import type { Preview } from '@storybook/react'

import { initialize, mswDecorator } from 'msw-storybook-addon'

import { Provider as ReduxStoreProvider } from 'react-redux'
import { store } from '../src/redux/store'
import { handlers } from '../mocks/handlers'
import '../src/global.css'

// Initialize MSW
initialize()

const preview: Preview = {
  parameters: {
    msw: { handlers: [...handlers] },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    mswDecorator,
    (Story) => (
      <ReduxStoreProvider store={store}>
        <Story />
      </ReduxStoreProvider>
    ),
  ],
}

export default preview
