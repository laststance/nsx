import React from 'react'
import ReactDOM from 'react-dom'
import { Provider as ReduxProvider } from 'react-redux'
import './index.css'
import * as serviceWorker from './serviceWorker'
import Routes from './systems/Routes'
import { store } from './redux'
import SnackBarSystem from './systems/SnackBarSystem'
import ErrorBoundary from './systems/ErrorBoundary'
import { Author } from '../DataStructure'

if (window.localStorage.getItem('login') === 'true') {
  const author = JSON.parse(
    window.localStorage.getItem('author') as string
  ) as Author

  store.dispatch({ type: 'LOGIN', payload: { author: author } })
}

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <SnackBarSystem />
        <Routes />
      </ReduxProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
