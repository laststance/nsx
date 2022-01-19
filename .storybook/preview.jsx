import './tailwind.css'
import { Provider as ReduxStoreProvider } from 'react-redux'
import { store } from '../src/redux/store'
import { BrowserRouter } from 'react-router-dom'

export const parameters = {
  layout: 'centered',
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
}

export const decorators = [(Story) =>
  <ReduxStoreProvider store={store}>
    <BrowserRouter>
      <Story/>
    </BrowserRouter>
  </ReduxStoreProvider>
]
