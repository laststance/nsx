import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA, { ga } from 'react-ga'
import { Provider as ReduxProvider } from 'react-redux'
import type { Metric } from 'web-vitals'

import './index.css'

import { login } from './redux/adminSlice'
import { API } from './redux/API'
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
      API.endpoints.isLoginReqest.initiate({ author })
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
 * Start React runtime
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

// @ts-ignore
// const root = ReactDOM.createRoot(document.getElementById('root'))
// root.render(<App />)

ReactDOM.render(<App />, document.getElementById('root'))

if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize('UA-68130749-5')

  function sendToAnalytics({ id, name, value }: Metric) {
    ga('send', 'event', {
      eventCategory: 'Web-Vitals',
      eventAction: name,
      eventValue: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
      eventLabel: id, // id unique to current page load
      nonInteraction: true, // avoids affecting bounce rate
    })
  }
  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals(sendToAnalytics)
}
