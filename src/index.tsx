import React from 'react'
import ReactDOM from 'react-dom'
import { Provider as ReduxProvider } from 'react-redux'

import './index.css'
import type { Author } from '../types'

import { login } from './redux/adminSlice'
import { Api } from './redux/api'
import { detectPreRender } from './redux/perfSlice'
import { store } from './redux/store'
import reportWebVitals from './reportWebVitals'
import ErrorBoundary from './systems/ErrorBoundary'
import Routes from './systems/Routes'
import SnackBarSystem from './systems/SnackBarSystem'

/**
 * =====================================================
 * Preparation Redux initial state before React runtime
 * =====================================================
 */
if (window.localStorage.getItem('login') === 'true') {
  const author = JSON.parse(
    window.localStorage.getItem('author') as string
  ) as Author
  // eslint-disable-next-line no-inner-declarations
  async function verify() {
    // @ts-ignore
    const { data } = await store.dispatch(
      Api.endpoints.isLoginReqest.initiate({ author })
    )
    if (data?.login === true) {
      store.dispatch(login(author))
    }
  }
  verify()
}

// @TODO fix Provider typing
// @ts-expect-error
ReduxProvider.displayName = 'ReduxProvider'
/**
 * ==============================================
 * Redux preparation end
 * ==============================================
 */

const App = () => (
  <React.StrictMode>
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <SnackBarSystem />
        <Routes />
      </ReduxProvider>
    </ErrorBoundary>
  </React.StrictMode>
)

const rootElement = document.getElementById('root') as HTMLDivElement
if (rootElement.hasChildNodes()) {
  store.dispatch(detectPreRender())
  ReactDOM.hydrate(<App />, rootElement)
} else {
  ReactDOM.render(<App />, rootElement)
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// eslint-disable-next-line no-console
reportWebVitals(console.info)
