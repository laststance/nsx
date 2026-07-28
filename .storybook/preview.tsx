import type { Preview } from '@storybook/react-vite'

import { mswLoader } from 'msw-storybook-addon/csf3'

import { Provider as ReduxStoreProvider } from 'react-redux'
import { store } from '../src/redux/store'
import { handlers } from '../mocks/handlers'
import '../src/global.css'

const preview: Preview = {
  loaders: [mswLoader()],
  parameters: {
    msw: { handlers: [...handlers] },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  decorators: [
    (Story) => (
      <ReduxStoreProvider store={store}>
        <Story />
      </ReduxStoreProvider>
    ),
  ],
}

export default preview
