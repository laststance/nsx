import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA, { ga } from 'react-ga'
import { Provider as ReduxStoreProvider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate as ReduxPersistGate } from 'redux-persist/integration/react'
import type { Metric } from 'web-vitals'

import './index.css'

import { store } from './redux/store'
import reportWebVitals from './reportWebVitals'
import Routing from './Routing'
import ErrorBoundary from './systems/ErrorBoundary'
import SnackBarSystem from './systems/SnackBarSystem'

const persistor = persistStore(store)
// @TODO fix Provider typing
// @ts-expect-error
ReduxStoreProvider.displayName = 'ReduxStoreProvider'

const App = () => (
  <ErrorBoundary>
    <ReduxStoreProvider store={store}>
      <ReduxPersistGate persistor={persistor}>
        <SnackBarSystem />
        <Routing />
      </ReduxPersistGate>
    </ReduxStoreProvider>
  </ErrorBoundary>
)

// @ts-ignore v18 @types coming not yet
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
