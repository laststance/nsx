import React from 'react'
import ReactDOM from 'react-dom'
import { Provider as ReduxProvider } from 'react-redux'
import './index.css'
import * as serviceWorker from './serviceWorker'
import Routes from './Routes'
import { store } from './redux'

ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <Routes />
    </ReduxProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
