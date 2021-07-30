import React, { Profiler } from 'react'
import ReactDOM from 'react-dom'
import { Provider as ReduxProvider } from 'react-redux'
import './index.css'
import Routes from './systems/Routes'
import SnackBarSystem from './systems/SnackBarSystem'
import ErrorBoundary from './systems/ErrorBoundary'
import { Author } from '../types'
import { store } from './redux/store'
import { login } from './redux/adminSlice'

if (window.localStorage.getItem('login') === 'true') {
  const author = JSON.parse(
    window.localStorage.getItem('author') as string
  ) as Author

  store.dispatch(login(author))
}

let queue: {
  id: any
  phase: any
  actualDuration: any
  baseDuration: any
  startTime: any
  commitTime: any
  interactions: any
}[] = []
// sendProfileQueue every 5 seconds
setInterval(sendProfileQueue, 5000)
function onRenderCallback(
  id: any,
  phase: any,
  actualDuration: any,
  baseDuration: any,
  startTime: any,
  commitTime: any,
  interactions: any
) {
  queue.push({
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions,
  })
}
function sendProfileQueue() {
  if (!queue.length) {
    return Promise.resolve()
  }
  const queueToSend = [...queue]
  queue = []
  // here's where we'd actually make the server call to send the queueToSend
  // data to our backend...
  console.info('sending profile queue', queueToSend)
  return Promise.resolve()
}

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <SnackBarSystem />
        <Profiler id="App" onRender={onRenderCallback}>
          <Routes />
        </Profiler>
      </ReduxProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
)
