import './tailwind.css'
import { Provider as ReduxStoreProvider } from 'react-redux'
import { store } from '../src/redux/store'
import { BrowserRouter } from 'react-router-dom'

const customViewports = {
  MacbookPro16: {
    name: 'Macbook Pro 16',
    styles: {
      width: '1792px',
      height: '1120px'

    }
  },
  kindleFire2: {
    name: 'Kindle Fire 2',
    styles: {
      width: '600px',
      height: '963px'
    }
  },
  kindleFireHD: {
    name: 'Kindle Fire HD',
    styles: {
      width: '533px',
      height: '801px'
    }
  }
}

export const parameters = {
  viewport: {
    viewports: customViewports,
    defaultViewports: 'Macbook Pro 16'
  },
  backgrounds: {
    default: 'light'
  },
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
